import React, { Component, PureComponent } from 'react';
import ReactDom from 'react-dom';
import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import clamp from 'lodash/clamp';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';
import lowerFirst from 'lodash/lowerFirst';
import isFunction from 'lodash/isFunction';
import { View, Text, ScrollView } from '@tarojs/components';
import { $ } from '@tarojs/extend';
import './index.scss';
import { toJS } from 'mobx';

// 当前环境相关
const isInWeb = Taro.getEnv() === Taro.ENV_TYPE.WEB;

// 组件BEM基础类（Block）
const blockClass = 'list-view';

// 外部样式类
const extClass = ['com-class'];

// 注册状态栏点击事件
isInWeb &&
    window.AbcBridge &&
    window.AbcBridge.registerHandler('statusBarTapped', () => {
        Taro.eventCenter.trigger('statusBarTapped');
    });

// 以动画的形式平滑的滚动到元素顶部
function smoothScrollBackTop(elem, target = 0, duration = 300) {
    // 如果元素已经滚动到目标距离时直接返回
    if (elem.scrollTop === target) {
        return;
    }

    // 缓动函数
    const easing = {
        outExpo(t) {
            return t == 1 ? 1 : -Math.pow(2, -10 * t) + 1;
        },
    };

    const start = elem.scrollTop;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    // 停止惯性滚动
    elem.style.overflow = 'hidden';

    // 不存在requestAnimationFrame时直接滚动到顶部
    if ('requestAnimationFrame' in window === false) {
        elem.scrollTop = target;
        elem.style.overflow = '';
        return;
    }

    // 动画滚动函数
    function scroll() {
        const now = 'now' in window.performance ? performance.now() : new Date().getTime();
        const time = Math.min(1, (now - startTime) / duration);
        const timeFunction = easing.outExpo(time);
        elem.scrollTop = Math.ceil(timeFunction * (target - start) + start);

        if (elem.scrollTop === target) {
            elem.style.overflow = '';
            return;
        }

        window.requestAnimationFrame(scroll);
    }

    // 开始滚动
    scroll();
}

export default class ListView extends PureComponent {
    static propTypes = {
        // 列表内容数据源数组
        hasData: PropTypes.bool,

        // 是否正在初始化加载
        initialLoading: PropTypes.bool,

        // 渲染列表头部
        renderHeader: PropTypes.func,

        // 渲染列表底部
        renderFooter: PropTypes.func,

        // 下拉属性正常提示文案
        refreshNormalText: PropTypes.string,

        // 下拉属性释放提示文案
        refreshReleaseText: PropTypes.string,

        // 下拉属性加载提示文案
        refreshLoadingText: PropTypes.string,

        // 滚动事件回调
        onScroll: PropTypes.func,
        scroll: PropTypes.arrayOf(PropTypes.func),

        // 下拉刷新事件回调
        // 传入参数：
        // args - 相关参数对象
        // callback - 请求完成的回调函数
        // callback参数一：错误对象，未出错时传null
        // callback参数二：响应的数据对象，没有或出错时传null
        onRefresh: PropTypes.func,
        refresh: PropTypes.arrayOf(PropTypes.func),

        // 是否存在更多数据，为true时列表滚动到底部时将触发onEndReached回调
        hasMore: PropTypes.bool,

        // 列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
        // 传入参数：
        // args - 相关参数对象
        // callback - 请求完成的回调函数
        // callback参数一：错误对象，未出错时传null
        // callback参数二：响应的数据对象，没有或出错时传null
        onEndReached: PropTypes.func,
        endReached: PropTypes.arrayOf(PropTypes.func),

        // 调用onEndReached之前的临界值，单位是像素
        onEndReachedThreshold: PropTypes.number,
    };

    static defaultProps = {
        hasMore: false,
        hasMore: false,
        initialLoading: false,
        refreshNormalText: '下拉刷新',
        refreshReleaseText: '释放更新',
        refreshLoadingText: '加载中...',
        scroll: null,
        onScroll: null,
        refresh: null,
        onRefresh: null,
        endReached: null,
        onEndReached: null,
        onEndReachedThreshold: 320,
    };

    constructor(props) {
        super(props);
        // 下拉拖动的最大距离，防止无限下拉
        this.maxPullDistance = 300;
    }

    // 下拉刷新指示器元素DOM对象
    domPtr = null;

    // 列表内容包装元素DOM对象
    domWrapper = null;

    // 下拉拖动的阻尼系数
    // damping = 1;
    isAndroid = (Taro.getSystemInfoSync()?.system ?? '').indexOf('Android') >= 0;
    damping = this.isAndroid ? 0.6 : 0.382;

    // 下拉刷新的拖动距离
    distanceToRefresh = 70;

    // 滚动视图容器垂直滚动距离
    scrollTop = 0;

    // 触摸激活状态
    touchActive = false;

    // 起始滚动距离
    startScrollTop = 0;

    // 开始触摸对象唯一标识符
    startTouchId = null;

    // 滚动视图视口高度
    scrollViewHeight = 0;

    // 下拉状态映射表
    pullStateMap = {
        normal: { state: 'normal', description: this.props.refreshNormalText },
        release: { state: 'release', description: this.props.refreshReleaseText },
        loading: { state: 'loading', description: this.props.refreshLoadingText },
    };

    state = {
        // TODO: 为虚拟化列表预留状态
        // 需要显示的列表项数据

        // 下拉状态
        pullState: this.pullStateMap.normal,

        // 是否启用列表滚动
        allowScroll: true,

        // 加载更多状态，loading: 加载中，done: 加载完成，error: 加载出错
        loadMoreState: 'done',

        // 列表内容下拉的距离
        pullDistance: 0,

        // 下拉刷新指示器的垂直偏移距离
        ptrOffsetY: 0,

        // 列表内容是否处于过渡动画状态
        isTransition: false,
    };

    // TODO: 临时方案，Taro官方修复此问题后应该移除改方案
    // 临时解决Taro组件继承后导致的事件（回调函数）属性为空问题
    getEventProps = prop => {
        // const fn = this.props[prop] || this.props[lowerFirst(prop.replace(/^on/, ''))];
        // return isArray(fn) ? fn[0] : fn;

        return this.props[prop];
    };

    async componentDidMount() {
        // Web环境下初始化相关DOM对象
        if (isInWeb) {
            this.domPtr = $(`.${blockClass}__ptr`).get(0);
            this.domWrapper = $(`.${blockClass}__wrapper`).get(0);
        }

        this.init();

        // 监听状态栏点击事件
        Taro.eventCenter.on('statusBarTapped', this.scrollBackTop);
    }

    componentWillUnmount() {
        // 删除状态栏点击事件
        Taro.eventCenter.off('statusBarTapped', this.scrollBackTop);

        // 删除相关DOM对象的引用
        if (isInWeb) {
            this.domPtr = null;
            this.domWrapper = null;
        }
    }

    componentWillReceiveProps(nextProps) {
        const { refreshNormalText, refreshReleaseText, refreshLoadingText } = nextProps;

        // 更新下拉状态文案
        this.pullStateMap.normal.description = refreshNormalText;
        this.pullStateMap.release.description = refreshReleaseText;
        this.pullStateMap.loading.description = refreshLoadingText;

        // 更新显示的列表项数据
    }

    // 初始化设置
    init = async () => {
        const style = await this.getScrollViewStyle();
        const { height, scrollTop } = style;
        this.scrollTop = scrollTop || 0;
        this.scrollViewHeight = height;
        this.maxPullDistance = height * 0.618 || 300;
    };

    // 获取滚动视图容器样式
    getScrollViewStyle = async () => {
        const query = Taro.createSelectorQuery(); //.in(Taro.getCurrentInstance().page);

        return new Promise(resolve => {
            query
                .selectAll(`.${blockClass}__scroll-view, .${blockClass}__wrapper`)
                .fields(
                    {
                        size: true,
                        scrollOffset: true,
                    },
                    styles => {
                        if (isEmpty(styles)) {
                            return resolve({});
                        }

                        let scrollTop = styles[0].scrollTop;
                        let scrollHeight = styles[1].scrollHeight;

                        if (isInWeb) {
                            let sv = $(`.${blockClass}__scroll-view`).get(0);
                            scrollTop = sv.scrollTop;
                            scrollHeight = sv.scrollHeight;
                        }

                        resolve({
                            ...styles[0],
                            scrollTop,
                            scrollHeight,
                            innerWidth: styles[1].width,
                        });
                    },
                )
                .exec();
        });
    };

    // 获取列表内容的垂直偏移距离
    getContentOffsetY = async () => {
        // const query = Taro.createSelectorQuery().in(isInWeb ? this : this.$scope);
        const query = Taro.createSelectorQuery();

        return new Promise(resolve => {
            query
                .selectAll(`.${blockClass}, .${blockClass}__content`)
                .boundingClientRect(styles => resolve(styles[1].top - styles[0].top))
                .exec();
        });
    };

    // 设置下拉状态
    setPullState = async (opts = {}) => {
        const { pullStateMap, distanceToRefresh } = this;
        let isRelease = !!opts.isRelease;
        let pullDistance = isRelease ? this.state.pullDistance : opts.pullDistance;
        let pullState = this.state.pullState;
        let ptrOffsetY = await this.getContentOffsetY();
        let overscroll = this.scrollTop < 0 ? Math.abs(this.scrollTop) : 0;

        // 强制下拉刷新
        if (opts.isForceRefresh) {
            // 模拟用户松手且下拉距离为下拉刷新的距离
            isRelease = true;
            pullDistance = ptrOffsetY = distanceToRefresh;
        }

        // 如果处于刷新状态直接返回
        if (!this.touchActive && !isRelease) {
            return;
        }

        // 下拉距离超过或等于下拉刷新的距离时，将下拉状态设为释放更新状态，否则为正常状态
        if (pullDistance + overscroll >= distanceToRefresh) {
            pullState = pullStateMap.release;
        } else {
            pullState = pullStateMap.normal;
        }

        // 用户松手时且下拉状态为释放更新状态时，将下拉状态设为加载（刷新）状态，否则还原下拉距离
        if (isRelease && pullState === pullStateMap.release) {
            pullState = pullStateMap.loading;
            pullDistance = ptrOffsetY = distanceToRefresh;
        } else if (isRelease) {
            pullDistance = ptrOffsetY = 0;
        }

        // 下拉刷新已被禁用，且非列表底部回弹，直接返回
        if (!isFunction(this.getEventProps('onRefresh')) && pullDistance >= 0) {
            return;
        }

        // 如果在Web环境下，调用优化版的状态更新方法，否则采用更新状态的方式
        this[isInWeb ? 'setPullStateForWeb' : 'setState'](
            {
                pullState,
                ptrOffsetY,
                pullDistance,
                isTransition: isRelease,
            },
            () => {
                // 触发下拉刷新处理
                pullState === pullStateMap.loading && this.handleRefresh();
            },
        );
    };

    // 针对Web环境优化的下拉刷新状态更新
    setPullStateForWeb = state => {
        const { pullState, ptrOffsetY, pullDistance, isTransition } = state;
        const { domPtr, domWrapper } = this;
        if (domPtr === null || domWrapper === null) {
            return;
        }

        // 直接更新状态
        /* eslint-disable */
        this.state.pullState = pullState;
        this.state.ptrOffsetY = ptrOffsetY;
        this.state.pullDistance = pullDistance;
        this.state.isTransition = isTransition;
        /* eslint-enable */

        // 直接更新下拉距离DOM样式
        domPtr.style.transform = `translate3d(0,${ptrOffsetY}px,0)`;
        domWrapper.style.transform = `translate3d(0,${pullDistance}px,0)`;
        domPtr.classList.toggle(`${blockClass}__ptr--transition`, isTransition);
        domWrapper.classList.toggle(`${blockClass}__wrapper--transition`, isTransition);

        // 更新下拉刷新指示器DOM
        domPtr.firstElementChild.classList.toggle(`${blockClass}__ptr-icon--up`, pullState.state === 'release');
        domPtr.firstElementChild.classList.toggle(`${blockClass}__ptr-icon--loading`, pullState.state === 'loading');
        domPtr.lastElementChild.innerHTML = pullState.description;

        // 触发下拉刷新处理
        pullState.state === 'loading' && this.handleRefresh();
    };

    // 重置下拉状态
    resetPullState = () => {
        // 如果在Web环境下，调用优化版的状态更新方法，否则采用更新状态的方式
        this[isInWeb ? 'setPullStateForWeb' : 'setState']({
            pullState: this.pullStateMap.normal,
            ptrOffsetY: 0,
            pullDistance: 0,
            isTransition: true,
        });
    };

    // 强制进行下拉刷新
    forceRefresh = () => {
        this.setPullState({
            isForceRefresh: true,
        });
    };

    // 手指按下，滑动开始
    handleTouchStart = async e => {
        // 忽略多手指触摸操作
        if (e.touches.length > 1) {
            return;
        }

        const touch = e.touches[0];
        this.startPos = {
            x: touch.clientX,
            y: touch.clientY,
        };

        // 开启触摸激活状态
        this.touchActive = true;

        const style = await this.getScrollViewStyle();

        this.direction = null;
        this.startScrollTop = style.scrollTop;
        this.startTouchId = touch.identifier;
        this.startPullDistance = this.state.pullDistance;

        this.setState({ isTransition: false });
    };

    // 手指移动，滑动平移中
    handleTouchMove = async e => {
        if (
            (this.direction && this.direction === 'x') ||
            this.startPos === null ||
            this.props.initialLoading ||
            this.state.pullState === this.pullStateMap.loading
        ) {
            isFunction(this.getEventProps('onRefresh')) && e.preventDefault();

            // 禁用列表滚动
            !isInWeb && this.direction && this.direction === 'x' && this.setState({ allowScroll: false });
            return;
        }

        // 只响应最先触摸的手指操作
        const touch = find(e.changedTouches, { identifier: this.startTouchId });
        if (!touch) {
            return;
        }

        const distance = {
            x: touch.clientX - this.startPos.x,
            y: touch.clientY - this.startPos.y,
        };

        // 设置滑动方向
        if (!this.direction) {
            this.direction = Math.abs(distance.x) > Math.abs(distance.y) ? 'x' : 'y';

            // 水平滑动时直接返回
            if (this.direction === 'x') {
                e.preventDefault();

                // 禁用列表滚动
                !isInWeb && this.setState({ allowScroll: false });
                return;
            }
        }

        const style = await this.getScrollViewStyle();
        const { height, scrollTop, scrollHeight } = style;
        const maxScrollTop = scrollHeight - height;
        this.scrollTop = scrollTop;

        const panDir = distance.y > 0 ? 'down' : 'up';
        let pullDistance =
            scrollTop <= 0 ? distance.y - this.startScrollTop : distance.y + (this.startScrollTop - maxScrollTop);

        // 未滚动到顶部或底部时直接返回
        if (scrollTop > 0 && scrollTop < maxScrollTop) {
            return;
        }

        if (scrollTop <= 0 && panDir === 'down') {
            e.preventDefault();

            pullDistance = clamp(pullDistance * this.damping, 0, this.maxPullDistance);
        } else if (scrollTop >= maxScrollTop && panDir === 'up') {
            e.preventDefault();
            pullDistance = clamp(pullDistance * this.damping, -this.maxPullDistance, 0);
        } else {
            return;
        }

        // 设置下拉状态
        this.setPullState({ pullDistance });
    };

    // 手指抬起，滑动结束
    handleTouchEnd = async e => {
        // 启用列表滚动
        !isInWeb && this.setState({ allowScroll: true });

        if (
            (this.direction && this.direction === 'x') ||
            this.props.initialLoading ||
            this.state.pullState === this.pullStateMap.loading
        ) {
            return;
        }

        // 只响应最先触摸的手指操作
        const touch = find(e.changedTouches, { identifier: this.startTouchId });
        if (!touch) {
            return;
        }

        // 取消触摸激活状态
        this.touchActive = false;

        // 设置下拉状态
        this.setPullState({ isRelease: true });
    };

    // 手指抬起或触摸被取消
    handleTouchCancel = async e => {
        this.handleTouchEnd(e);
    };

    // 下拉刷新
    handleRefresh = async () => {
        const onRefresh = this.getEventProps('onRefresh');

        // 如果刷新回调函数不存在，直接返回并重置下拉状态
        if (!isFunction(onRefresh)) {
            return this.resetPullState();
        }

        // 调用下拉刷新事件回调
        try {
            await onRefresh();
            this.resetPullState();
        } catch (err) {
            console.error(err);
        }
    };

    // 列表滚动到底部，加载更多
    handleEndReached = async () => {
        const { hasMore } = this.props;
        const { loadMoreState } = this.state;
        const onEndReached = this.getEventProps('onEndReached');

        // 如果加载更多回调函数不存在，直接返回并重置加载更多状态
        if (!isFunction(onEndReached) || !hasMore || loadMoreState === 'loading') {
            return;
        }

        // 显示加载更多loading
        this.setState({ loadMoreState: 'loading' });

        try {
            await onEndReached();
            // 加载成功
            this.setState({ loadMoreState: 'done' });
        } catch (err) {
            console.error(err);
            this.setState({ loadMoreState: 'error' });
        }
    };

    // 列表滚动事件处理
    handleScroll = e => {
        const { scrollTop } = e.detail;
        const onScroll = this.getEventProps('onScroll');
        const detail = {
            ...e.detail,
            deltaY: scrollTop - this.scrollTop,
            offsetHeight: Math.round(this.scrollViewHeight),
        };
        this.scrollTop = scrollTop;

        // 触发列表滚动事件
        isFunction(onScroll) && onScroll(detail);
        Taro.eventCenter.trigger('scroll.listview', detail);
    };

    // 滚动到列表顶部
    scrollBackTop = () => {
        if (!isInWeb) {
            return;
        }

        const { top, left } = $(blockClass)
            .get(0)
            .getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        // 判断列表视图是否在视口范围内
        if (top >= 0 && top < innerHeight && left >= 0 && left < innerWidth) {
            // 平滑滚动到列表顶部
            smoothScrollBackTop($(`.${blockClass}__ptr`)(`.${blockClass}__scroll-view`).get(0));
        }
    };

    render() {
        const { hasMore, hasData, onEndReachedThreshold, navBarHeight = 0 } = this.props;
        const { pullState, ptrOffsetY, allowScroll, loadMoreState, pullDistance, isTransition } = this.state;

        // 组件根样式类
        const rootClass = classNames(blockClass, extClass, this.props[extClass[0]]);
        return (
            <View className={rootClass}>
                {/* 下拉指示器区域 */}
                <View
                    className={classNames(`${blockClass}__ptr`, {
                        [`${blockClass}__ptr--transition`]: isTransition,
                    })}
                    style={{ transform: `translate3d(0,${ptrOffsetY + navBarHeight}px,0)` }}
                >
                    <View
                        className={classNames(`${blockClass}__ptr-icon`, {
                            [`${blockClass}__ptr-icon--up`]: pullState.state === 'release',
                            [`${blockClass}__ptr-icon--loading`]: pullState.state === 'loading',
                        })}
                    />
                    <Text>{pullState.description}</Text>
                </View>

                <ScrollView
                    className={`${blockClass}__scroll-view`}
                    scrollY={allowScroll}
                    onScroll={this.handleScroll}
                    lowerThreshold={onEndReachedThreshold}
                    onScrollToLower={this.handleEndReached}
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={throttle(this.handleTouchMove, this.isAndroid ? 50 : 1000 / 60)}
                    onTouchEnd={this.handleTouchEnd}
                    onTouchCancel={this.handleTouchCancel}
                >
                    <View
                        className={classNames(`${blockClass}__wrapper`, {
                            [`${blockClass}__wrapper--transition`]: isTransition,
                        })}
                        style={{ transform: `translate3d(0,${pullDistance}px,0)` }}
                    >
                        {/* 列表内容区域 */}
                        <View className={`${blockClass}__content`}>
                            <View className={`${blockClass}__header`}>
                                {this.props.renderHeader && this.props.renderHeader()}
                            </View>

                            <View className={`${blockClass}__sticky`}>
                                {this.props.renderSticky && this.props.renderSticky()}
                            </View>

                            <View className={`${blockClass}__body`}>
                                {/* 渲染列表内容 */}
                                {this.props.children}

                                {/* 加载更多指示器区域 */}
                                {hasData && isFunction(this.getEventProps('onEndReached')) && (
                                    <View className={`${blockClass}__load-more`}>
                                        {!hasMore && <Text className="footer-nomore-holder">— 我也是有底线的哦 —</Text>}

                                        {hasMore && loadMoreState === 'error' && (
                                            <View
                                                className={`${blockClass}__load-more-button`}
                                                onClick={this.handleEndReached}
                                            >
                                                加载时出错，点击重试
                                            </View>
                                        )}

                                        {hasMore && loadMoreState === 'loading' && (
                                            <View className={`${blockClass}__load-more-loading`}>
                                                <View className={`${blockClass}__load-more-icon`} />
                                                <Text>加载中...</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>

                            <View className={`${blockClass}__footer`}>
                                {this.props.renderFooter && this.props.renderFooter()}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
