import React, { PureComponent } from "react";
import Taro from "@tarojs/taro";
import isEmpty from "lodash/isEmpty";
import classNames from "classnames";
import { View, Image } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import ListView from "@/components/ListView";
import Loading from "@/components/Loading";
import EmptyHolder from "@/components/EmptyHolder";
import "./index.scss";

// 当前环境相关
const isInWeb = Taro.getEnv() === Taro.ENV_TYPE.WEB;

// 组件BEM基础类（Block）
const blockClass = "common-list-layout";

// 外部样式类

export default class CommonListLayout extends PureComponent {
  state = {
    // 是否已准备好渲染
    readyToRender: false,

    // 是否隐藏搜索栏
    isHideSearchBar: false,
  };

  // 根元素的引用对象
  refRootNode = null;

  componentDidMount() {
    // 临时修复Taro热更新引起的样式错误
    process.env.NODE_ENV === "development" &&
      isInWeb &&
      setTimeout(() => this.setState({ readyToRender: true }), 200);

    // 如果存在搜素栏，监听列表滚动以切换搜索栏显示与隐藏状态
    this.props.showSearchBar &&
      Taro.eventCenter.on("scroll.listview", this.handleListViewScroll);
  }

  componentWillUnmount() {
    // 如果存在搜素栏，取消监听列表滚动
    this.props.showSearchBar &&
      Taro.eventCenter.off("scroll.listview", this.handleListViewScroll);
  }

  // 列表滚动处理
  handleListViewScroll = (detail) => {
    const { deltaY, scrollTop, offsetHeight, scrollHeight } = detail;
    const { isHideSearchBar } = this.state;

    // 忽略iOS的溢出回弹滚动，以阻止抖动
    if (scrollTop <= 0 || scrollTop >= scrollHeight - offsetHeight) {
      return;
    }

    // 根据列表视图的滚动方向来显示或隐藏搜索栏
    if (deltaY > 0 && !isHideSearchBar) {
      // 向下滚动，隐藏
      if (isInWeb && this.refRootNode) {
        // Web端的滚动优化
        // eslint-disable-next-line
        this.state.isHideSearchBar = true;
        this.refRootNode.vnode.dom.classList.add("is-hide-search-bar");
      } else {
        this.setState({ isHideSearchBar: true });
      }
    } else if (deltaY < 0 && isHideSearchBar) {
      // 向上滚动，显示
      if (isInWeb && this.refRootNode) {
        // Web端的滚动优化
        // eslint-disable-next-line
        this.state.isHideSearchBar = false;
        this.refRootNode.vnode.dom.classList.remove("is-hide-search-bar");
      } else {
        this.setState({ isHideSearchBar: false });
      }
    }
  };

  renderPlaceholder = () => {
    const {
      loadState,
      placeholder,
      renderLoading,
      renderError,
      renderEmpty,
    } = this.props;

    if (loadState === "loading") {
      return renderLoading ? (
        renderLoading()
      ) : (
        <View className="invalid-container">
          <Loading />
        </View>
      );
    }

    if (loadState === "error") {
      return renderError ? (
        renderError()
      ) : (
        <View className="invalid-container">
          <EmptyHolder placeholder={placeholder} emptyImg={this.props.emptyImg} />
        </View>
      );
    }

    if (loadState === "done") {
      return renderEmpty ? (
        renderEmpty()
      ) : (
        <View className="invalid-container">
          <EmptyHolder placeholder={placeholder} emptyImg={this.props.emptyImg} />
        </View>
      );
    }
  };

  render() {
    const { hasData, className, navBarHeight } = this.props;
    // 等到准备好渲染时才进行渲染
    if (
      process.env.NODE_ENV === "development" &&
      process.env.TARO_ENV === "h5" &&
      !this.state.readyToRender
    ) {
      return null;
    }

    // 组件根样式类
    const rootClass = classNames(blockClass, className, {
      "is-hide-search-bar": this.state.isHideSearchBar,
    });

    return (
      <View className={rootClass} ref={(node) => (this.refRootNode = node)}>
        <View className={`${blockClass}__container`}>
          <ListView
            navBarHeight={navBarHeight}
            hasData={hasData}
            hasMore={this.props.hasMore}
            renderHeader={this.props.renderHeader}
            renderSticky={this.props.renderSticky}
            renderFooter={this.props.renderFooter}
            onRefresh={this.props.onRefresh}
            _scrollTop={this.props.scrollTop}
            onEndReached={this.props.onEndReached}
          >
            {hasData
              ? this.props.children
              : this.renderPlaceholder()
              
              }
          </ListView>
        </View>

        {this.props.renderLayoutFooter && (
          <View className={`${blockClass}__footer`}>
            {this.props.renderLayoutFooter()}
          </View>
        )}
      </View>
    );
  }
}
