import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Image, OpenData, Picker } from '@tarojs/components';
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

    fetchData = async ({ pageNum: pn } = {}) => {
        let { pageNum, pageSize, dataSource, dateType, userType, startTime, endTime } = this.state;
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

        if (dateType > -1) {
            let xRnage = getRangeTimeByType(dateTypes[dateType].type);
            if (xRnage) {
                startTime = xRnage.start;
                endTime = xRnage.end;
            }
        }

        let res = await promise({
            start: startTime,
            end: endTime,
            pageNum,
            pageSize,
        });
        if (res?.code == 200 && res?.result?.list?.length) {
            // 刷新数据
            this.setState({
                loading: false,
                hasMore: res?.result?.list?.length === pageSize,
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
                url: '/pages/merchantStatistic/index?userId=' + user.userId,
            });
        } else {
            Taro.navigateTo({
                url: '/pages/customerStatistic/index?userId=' + user.userId,
            });
        }
    };

    handleExport = async () => {
        let { loading, hasMore, dataSource, dateType, startTime, endTime } = this.state;

        if (dateType > -1) {
            let xRange = getRangeTimeByType(dateTypes[dateType].type);
            if (xRange) {
                startTime = xRange.start;
                endTime = xRange.end;
            }
        }

        Taro.downloadFile({
            url: `https://senchuangyefan.cn:9090/waimai/poi/createExecl?start=${startTime.split(' ')[0]}&end=${
                endTime.split(' ')[0]
            }`,
            header: {
                token: Taro.getStorageSync('sessionToken'),
            },
            success(res) {
                var filePath = res.tempFilePath;
                Taro.openDocument({
                    filePath: filePath,
                    success: function() {
                        console.log('打开文档成功');
                    },
                });
            },
            fail() {
                Taro.showToast({
                    icon: 'none',
                    title: '文件下载失败',
                });
            },
        });
    };

    handleScan = () => {
        Taro.scanCode({
            async success(res) {
                if (res.errMsg !== 'scanCode:ok') {
                    Taro.showToast({
                        title: res.errMsg || '扫码失败',
                    });

                    return;
                }

                let data = res.result;
                console.log('scan ', data);
                try {
                    if (res.code === 200) {
                        Taro.showToast({
                            icon: 'none',
                            title: data,
                        });
                    } else {
                        Taro.showToast({
                            icon: 'none',
                            title: res?.message || '扫码失败',
                        });
                    }
                } catch (e) {
                    Taro.showToast({
                        icon: 'none',
                        title: '扫码失败',
                    });
                }
                
            },
        });
    }

    render() {
        let { loading, hasMore, dataSource, userType, startTime, endTime, dateType } = this.state;
        let { userInfo } = this.props.loginStore;
        if (dateType > -1) {
            let xRange = getRangeTimeByType(dateTypes[dateType].type);
            if (xRange) {
                startTime = xRange.start;
                endTime = xRange.end;
            }
        }
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
                        <View className="page-headerx">
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
                            <View className="time-filter">
                                <Picker
                                    mode="date"
                                    value={startTime}
                                    onChange={val => {
                                        this.setState({
                                            dateType: -1,
                                            startTime: val.detail.value + ' 00:00:00',
                                        });
                                    }}
                                >
                                    <View style={{ padding: '5px' }}>开始:{(startTime || '').split(' ')[0]}</View>
                                </Picker>

                                <Picker
                                    mode="date"
                                    value={endTime}
                                    onChange={val => {
                                        this.setState({
                                            dateType: -1,
                                            endTime: val.detail.value + ' 23:59:59',
                                        });
                                    }}
                                >
                                    <View style={{ padding: '5px' }}>结束:{(endTime || '').split(' ')[0]}</View>
                                </Picker>

                                <View
                                    style={{
                                        padding: '2px 5px',
                                        marginLeft: '5px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                    onClick={() => {
                                        this.fetchData({ pageNum: 1 });
                                    }}
                                >
                                    时间筛选
                                </View>
                                <View
                                    style={{
                                        padding: '2px 5px',
                                        marginLeft: '5px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                    onClick={this.handleExport}
                                >
                                    导出
                                </View>
                            </View>

                            <View className="total-container">总计:{this.state.total}</View>
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
                    renderLayoutFooter={() => (
                        <View className="btn-apply" onClick={this.handleScan}>
                            扫码
                        </View>
                    )}
                >
                    <View className="t-body">
                        {(dataSource || []).map(each => (
                            <View className="t-row" key={each.userId} onClick={this.handlNav.bind(this, each)}>
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
