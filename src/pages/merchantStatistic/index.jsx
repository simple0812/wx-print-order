import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Image, OpenData, Picker, Button } from '@tarojs/components';
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
        let { userId } = Taro.getCurrentInstance().router.params;
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

    fetchData = async ({ pageNum: pn } = {}) => {
        let { pageNum, pageSize, dataSource, dateType, userId, startTime, endTime } = this.state;
        if (pn) {
            pageNum = pn;
        }
        this.setState({
            loading: true,
        });
        if (dateType > -1) {
            let xRnage = getRangeTimeByType(dateTypes[dateType].type);
            if (xRnage) {
                startTime = xRnage.start;
                endTime = xRnage.end;
            }
        }
        let res = await this.props.loginStore.getMerchantOrders({
            start: startTime,
            end: endTime,
            userId,
            pageNum,
            pageSize,
        });
        if (res?.code == 200 && res?.result?.list?.length) {
            // 刷新数据
            this.setState({
                loading: false,
                hasMore: res?.result?.list?.length === pageSize,
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
            url: `https://senchuangyefan.cn:9090/waimai/poi/createExecl?start=${startTime.split(' ')[0]}&end=${endTime.split(' ')[0]}`,
            header: {
                token: Taro.getStorageSync('sessionToken'),
            },
            success(res) {
                var filePath = res.tempFilePath
                Taro.openDocument({
                  filePath: filePath,
                  success: function () {
                    console.log('打开文档成功')
                  }
                })
            },
            fail() {
                Taro.showToast({
                    icon: 'none',
                    title: '文件下载失败'
                })
            }
        })

    }

    render() {
        let { loading, hasMore, dataSource, dateType, startTime, endTime } = this.state;
        const { userInfo } = this.props.loginStore;

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
                              
                            </View>
                            <View className="total-container">总计:{this.state.total}</View>
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
