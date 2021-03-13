import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Image, OpenData, Button } from '@tarojs/components';
import CommonListLayout from '@/components/ScrollLayout';
import BnqModal from '@/components/BnqModal';
import isEmpty from 'lodash/isEmpty';
import { AtAvatar } from 'taro-ui';
import Taro from '@tarojs/taro';
import taroFnToPromise from '@/utils/taroFnToPromise';

import designerService from '@/service/designer';

import './index.less';

function formatNumber(num) {
    if (!+num || +num < 10000) return num;

    return (num / 10000).toFixed(2) + 'w';
}

@inject(store => {
    return {
        loginStore: store.loginStore,
    };
})
@observer
class Index extends React.Component {
    // 这里必须用写个static同名函数 要不分享不显示定义的标题等参数
    static onShareAppMessage() {
        return {};
    }

    constructor() {
        super(...arguments);
        this.state = {
            dataSource: [],
            hasMore: true,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        };
    }

    componentDidMount() {
        this.initData();
    }

    componentWillUnmount() {}

    onShareAppMessage = res => {
        return {};
    };

    initData = async () => {
        let userRes = await this.props.loginStore.tryGetUserInfo();
        this.fetchData({ pageNum: 1 });
    };

    fetchData = async ({ pageNum: pn }) => {
        const { userInfo } = this.props.loginStore;
        let { pageNum, pageSize, dataSource } = this.state;
        if (pn) {
            pageNum = pn;
        }
        this.setState({
            loading: true,
        });
        let res = await designerService.getCaseList({
            designerCode: userInfo?.designerCode || '',
            pageNum,
            pageSize,
        });
        if (res?.success && res?.data?.list?.length) {
            // 刷新数据
            this.setState({
                loading: false,
                hasMore: true,
                pageNum: pageNum + 1,
                total: res?.data?.total || 0,
                dataSource: pn == 1 ? [...res.data.list] : [...dataSource, ...res.data.list],
            });
        } else {
            this.setState({
                loading: false,
                hasMore: false,
            });
        }

        return res;
    };

    isLogin = () => {
        const { userInfo } = this.props.loginStore;

        return !!userInfo.designerCode;
    };

    scanCode = () => {
        Taro.scanCode({
            success(res) {
                if (res.errMsg !== 'scanCode:ok') {
                    Taro.showToast({
                        title: res.errMsg || '扫码失败',
                    });

                    return;
                }

                let data = res.result;
                Taro.showToast({
                    icon: 'none',
                    title: data || '识别失败'
                })
            },
        });
    };

    renderHeader = () => {
        const { userInfo } = this.props.loginStore;

        return (
            <>
                <View className="page-header">
                    <Image src={require('./assets/h-bg.png')} mode="aspectFill" className="header-image" />
                    <View className="header-container">
                        <View className="user-container">
                            <OpenData type="userAvatarUrl" className="user-avatar" />
                            <View className="user-info">
                                <OpenData type='userNickName' className='user-info-name' />
                            </View>
                            <View className="setting-container" onClick={this.scanCode}>
                                <Button className="user-setting">扫码</Button>
                            </View>
                        </View>
                        <View className="user-data">
                            <View className="data-item">
                                <View className="data-item-count">{formatNumber(userInfo?.visitCount || 0)}</View>
                                <View className="data-item-label">今日</View>
                            </View>
                            <View className="data-item">
                                <View className="data-item-count">{formatNumber(userInfo?.shareCount || 0)}</View>
                                <View className="data-item-label">总计</View>
                            </View>
                        </View>
                    </View>
                </View>
            </>
        );
    };

    refreshData = async () => {
        await this.fetchData({ pageNum: 1 });
    };

    loadMore = async () => {
        await this.fetchData();
    };

    render() {
        const { loading, hasMore, total } = this.state;
        return (
            <>
                <CommonListLayout
                    className="index-page"
                    placeholder="您还没上传案例"
                    emptyImg={require('@/assets/case-empty.png')}
                    // hasData={!isEmpty(this.state.dataSource)}
                    hasData
                    loadState={loading ? 'pending' : 'done'}
                    hasMore={hasMore}
                    renderHeader={this.renderHeader}
                    onRefresh={this.refreshData}
                    onEndReached={this.loadMore}
                >
                    <View className="t-head">
                        <View className="t-cell">测试t1</View>
                        <View className="t-cell">测试t2</View>
                    </View>
                    <View className="t-body">
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>

                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                        <View className="t-row">
                            <View className="t-cell">测试1</View>
                            <View className="t-cell">测试2</View>
                        </View>
                    </View>
                </CommonListLayout>
            </>
        );
    }
}

export default Index;
