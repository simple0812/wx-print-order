import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Input, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SettingItem from '@/components/SettingItem';
import { AtTabs } from 'taro-ui';
import { getRangeTimeByType, dateTypes } from '@/utils/dateFormat';
import './index.less';

@inject(store => {
    return {
        loginStore: store.loginStore,
    };
})
@observer
class Merchant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateType: 0,
            model: {
                printCount: 1,
            },
            statistic: {},
        };
    }

    componentDidMount() {
        this.getStatistic();
    }

    getStatistic = () => {
        const { userInfo } = this.props.loginStore;
        const { dateType } = this.state;
        this.props.loginStore
            .customerStatistic({
                ...getRangeTimeByType(dateTypes[dateType].type),
                userId: userInfo?.id,
            })
            .then(res => {
                if (res?.code === 200) {
                    this.setState({
                        statistic: res?.result,
                    });
                }
            });
    };

    handleParamsChange = (key, evt) => {
        const { model } = this.state;

        model[key] = evt.detail.value;
        this.setState({
            model,
        });
    };

    handleChange = value => {
        const { model } = this.state;

        model.isMultiple = value;
        this.setState({
            model,
        });
    };

    scanCode = () => {
        const { userInfo } = this.props.loginStore;
        let _this = this;
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
                    data = JSON.parse(data);
                } catch (e) {
                    data = {};
                }
                let dRes = await _this.props.loginStore.scanCode({
                    id: data?.id,
                    bindStatus: true,
                    userId: userInfo?.id,
                });
                if (dRes?.code == 200) {
                    Taro.showToast({
                        icon: 'none',
                        title: '扫码成功',
                    });
                } else {
                    Taro.showToast({
                        icon: 'none',
                        title: dRes?.message || '识别失败',
                    });
                }
            },
        });
    };

    navEdit = () => {
        // Taro.navigateTo({
        //     url: '/pages/customerRegist/index'
        // })
    };
    render() {
        const { userInfo } = this.props.loginStore;
        const { statistic } = this.state;
        return (
            <View className="orderApply">
                <SettingItem
                    title="学生名称"
                    extraText={userInfo?.userName ?? '未填写'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="联系方式"
                    extraText={userInfo?.phone ?? '未填写'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="学号"
                    extraText={userInfo?.studentNum ?? '未填写'}
                    bottomGap
                    arrow
                    onItemClick={this.navEdit}
                />
                <View>
                    <AtTabs
                        current={this.state.dateType}
                        tabList={dateTypes}
                        onClick={curr => {
                            this.setState(
                                {
                                    dateType: curr,
                                },
                                this.getStatistic,
                            );
                        }}
                    />
                </View>
                <SettingItem title="总计单数" extraText={statistic['总计单数'] || '0'} bottomGap />
                <View className="form-container">
                    <View className="btn-apply" onClick={this.scanCode}>
                        扫码
                    </View>
                    <View
                        className="btn-detail"
                        onClick={() => {
                            Taro.navigateTo({
                                url: '/pages/customerStatistic/index?userId=' + userInfo?.id,
                            });
                        }}
                    >
                        查看学生统计
                    </View>
                </View>
            </View>
        );
    }
}

export default Merchant;
