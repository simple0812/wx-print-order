import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Image, OpenData, Button } from '@tarojs/components';
import CommonListLayout from '@/components/ScrollLayout';
import { getRangeTimeByType, dateTypes } from '@/utils/dateFormat';
import { AtTabs } from 'taro-ui';
import Taro from '@tarojs/taro';

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
        let {userId} = Taro.getCurrentInstance().router.params;
        this.state = {
            userId,
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
        let { pageNum, pageSize, dataSource, dateType, userId } = this.state;
        if (pn) {
            pageNum = pn;
        }
        this.setState({
            loading: true,
        });
        let res = await this.props.loginStore.getCustomerOrders({
            ...getRangeTimeByType(dateTypes[dateType].type),
            userId,
            pageNum,
            pageSize,
        });
        if (res?.code == 200 && res?.result?.list?.length) {
            // 刷新数据
            this.setState({
                loading: false,
                hasMore: true,
                pageNum: pageNum + 1,
                total: res?.result?.total || 0,
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

    render() {
        const { loading, hasMore, dataSource } = this.state;
        return (
            <>
                <CommonListLayout
                    className="index-page"
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
                            <View className="t-head">
                                <View className="t-cell">商家编号</View>
                                <View className="t-cell">商家名称</View>
                                <View className="t-cell">打印编码</View>
                                <View className="t-cell">扫码时间</View>
                            </View>
                        </View>
                    )}
                >
                    <View className="t-body">
                        {(dataSource || []).map(each => (
                            <View className="t-row" key={each.id}>
                                <View className="t-cell">{each.sellerId}</View>
                                <View className="t-cell">{each.sellerName}</View>
                                <View className="t-cell">{each.orderNum}</View>
                                <View className="t-cell">{each.bindTime}</View>
                            </View>
                        ))}
                    </View>
                </CommonListLayout>
            </>
        );
    }
}

export default Index;
