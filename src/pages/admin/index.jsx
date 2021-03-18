import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Image, OpenData, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import CommonListLayout from '@/components/ScrollLayout';
import { getRangeTimeByType, dateTypes } from '@/utils/dateFormat';
import { AtTabs } from 'taro-ui';

import './index.less';

@inject(store => {
    return {
        loginStore: store.loginStore,
    };
})
@observer
class Admin extends React.Component {
    // 这里必须用写个static同名函数 要不分享不显示定义的标题等参数
    static onShareAppMessage() {
        return {};
    }

    constructor() {
        super(...arguments);
        this.state = {
            userType: 0,
            dateType: 0,
            dataSource: [],
            hasMore: true,
            pageNum: 1,
            pageSize: 20,
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
        this.fetchData({ pageNum: 1 });
    };

    fetchData = async ({ pageNum: pn }) => {
        let { pageNum, pageSize, dataSource, dateType, userType } = this.state;
        if (pn) {
            pageNum = pn;
        }
        this.setState({
            loading: true,
        });
        let promise = this.props.loginStore.getMerchantList;
        if (userType == 1) {
            promise = this.props.loginStore.getCustomerList;
        }
        let res = await promise({
            ...getRangeTimeByType(dateTypes[dateType].type),
            pageNum,
            pageSize,
        });
        if (res?.code == 200 && res?.result?.list?.length) {
            // 刷新数据
            this.setState({
                loading: false,
                hasMore: true,
                total: res?.result?.total || 0,
                pageNum: pageNum + 1,
                dataSource: pn == 1 ? [...res.result.list] : [...dataSource, ...res.result.list],
            });
        } else {
            this.setState({
                loading: false,
                hasMore: false,
            });
        }

        return res;
    };

    refreshData = async () => {
        await this.fetchData({ pageNum: 1 });
    };

    loadMore = async () => {
        await this.fetchData();
    };

    handlNav = user => {
        const { userType } = this.state;

        if (userType == 0) {
            Taro.navigateTo({
                url: '/pages/merchantStatistic?userId=' + user.userId,
            });
        } else {
            Taro.navigateTo({
                url: '/pages/customerStatistic?userId=' + user.userId,
            });
        }
    };

    render() {
        const { loading, hasMore, dataSource, userType } = this.state;
        return (
            <>
                <CommonListLayout
                    className="merchant-s-page"
                    placeholder="数据为空"
                    emptyImg={require('@/assets/case-empty.png')}
                    hasData={!!dataSource?.length}
                    loadState={loading ? 'pending' : 'done'}
                    hasMore={hasMore}
                    onRefresh={this.refreshData}
                    onEndReached={this.loadMore}
                    renderHeader={() => (
                        <View className="page-header">
                            <View>
                                <AtTabs
                                    current={this.state.userType}
                                    tabList={[{ title: '商户' }, { title: '学生' }]}
                                    onClick={curr => {
                                        this.setState(
                                            {
                                                userType: curr,
                                            },
                                            () => {
                                                this.fetchData({ pageNum: 1 });
                                            },
                                        );
                                    }}
                                />
                            </View>
                            <View>
                                <AtTabs
                                    current={this.state.dateType}
                                    tabList={dateTypes}
                                    onClick={curr => {
                                        this.setState(
                                            {
                                                dateType: curr,
                                            },
                                            () => {
                                                this.fetchData({ pageNum: 1 });
                                            },
                                        );
                                    }}
                                />
                            </View>
                            <View>总计:{this.state.total}</View>
                            {userType == 0 ? (
                                <View className="t-head">
                                    <View className="t-cell">商家编号</View>
                                    <View className="t-cell">商家名称</View>
                                    <View className="t-cell">派单数</View>
                                </View>
                            ) : (
                                <View className="t-head">
                                    <View className="t-cell">学生编号</View>
                                    <View className="t-cell">学生名称</View>
                                    <View className="t-cell">接单数</View>
                                </View>
                            )}
                        </View>
                    )}
                >
                    <View className="t-body">
                        {(dataSource || []).map(each => (
                            <View className="t-row" key={each.userId} onClick={this.handlNav.bind(each)}>
                                <View className="t-cell">{each.userId}</View>
                                <View className="t-cell">{each.userName}</View>
                                <View className="t-cell">{each.countNum}</View>
                            </View>
                        ))}
                    </View>
                </CommonListLayout>
            </>
        );
    }
}

export default Admin;