import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Image, OpenData, Button } from '@tarojs/components';
import CommonListLayout from '@/components/ScrollLayout';


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
            dataSource: [
                { id: '1', name: 'text', code: 'xxxxx' },
                { id: '2', name: 'text', code: 'xxxxx' },
                { id: '3', name: 'text', code: 'xxxxx' },
                { id: '4', name: 'text', code: 'xxxxx' },
                { id: '5', name: 'text', code: 'xxxxx' },
                { id: '6', name: 'text', code: 'xxxxx' },
                { id: '7', name: 'text', code: 'xxxxx' },
                { id: '8', name: 'text', code: 'xxxxx' },
                { id: '9', name: 'text', code: 'xxxxx' },
                { id: '10', name: 'text', code: 'xxxxx' },
                { id: '11', name: 'text', code: 'xxxxx' },
                { id: '12', name: 'text', code: 'xxxxx' },
                { id: '13', name: 'text', code: 'xxxxx' },
                { id: '14', name: 'text', code: 'xxxxx' },
                { id: '15', name: 'text', code: 'xxxxx' },
                { id: '16', name: 'text', code: 'xxxxx' },
                { id: '17', name: 'text', code: 'xxxxx' },
                { id: '18', name: 'text', code: 'xxxxx' },
                { id: '19', name: 'text', code: 'xxxxx' },
            ],
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
        let { pageNum, pageSize, dataSource } = this.state;
        if (pn) {
            pageNum = pn;
        }
        this.setState({
            loading: true,
        });
        let res = await this.props.loginStore.getCustomerOrders({
            userId: userInfo?.id || '',
            pageNum,
            pageSize,
        });
        if (res?.success && res?.data?.list?.length) {
            // 刷新数据
            this.setState({
                loading: false,
                hasMore: true,
                pageNum: pageNum + 1,
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
                >
                    <View className="t-head">
                        <View className="t-cell">商家编号</View>
                        <View className="t-cell">商家名称</View>
                        <View className="t-cell">打印编码</View>
                        <View className="t-cell">扫码时间</View>
                    </View>
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
