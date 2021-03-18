import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Image, OpenData, Button } from '@tarojs/components';
import CommonListLayout from '@/components/ScrollLayout';
import { getRangeTimeByType, dateTypes } from '@/utils/dateFormat';
import { AtTabs } from 'taro-ui';

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
        const { userInfo } = this.props.loginStore;
        let { pageNum, pageSize, dataSource, dateType } = this.state;
        if (pn) {
            pageNum = pn;
        }
        this.setState({
            loading: true,
        });
        let res = await this.props.loginStore.getMerchantOrders({
            ...getRangeTimeByType(dateTypes[dateType].type),

            userId: userInfo?.id || '',
            pageNum,
            pageSize,
        });
        if (res?.code == 200 && res?.result?.list?.length) {
            // 刷新数据
            this.setState({
                loading: false,
                hasMore: true,
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

    render() {
        const { loading, hasMore, dataSource } = this.state;
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
                            <View className="t-head">
                                <View className="t-cell">学生编号</View>
                                <View className="t-cell">学生名称</View>
                                <View className="t-cell">打印编码</View>
                                <View className="t-cell">派送时间</View>
                            </View>
                        </View>
                    )}
                >
                    <View className="t-body">
                        {(dataSource || []).map(each => (
                            <View className="t-row" key={each.id}>
                                <View className="t-cell">{each.studentId}</View>
                                <View className="t-cell">{each.studentName}</View>
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
