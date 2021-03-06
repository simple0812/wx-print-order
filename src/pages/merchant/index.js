import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Input, Image, Button } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import Taro from '@tarojs/taro';
import SettingItem from '@/components/SettingItem';
import dateFormat, { getRangeTimeByType, dateTypes } from '@/utils/dateFormat';

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
            printer: {},
            statistic: {},
        };
    }

    componentDidMount() {
        const { userInfo } = this.props.loginStore;

        this.getStatistic();
        this.props.loginStore.getPrinterByUserId({ userId: userInfo?.id }).then(res => {
            if (res?.code === 200) {
                this.setState({
                    printer: res?.result,
                });
            }
        });
    }

    getStatistic = () => {
        const { userInfo } = this.props.loginStore;
        const { dateType } = this.state;
        this.props.loginStore
            .merchantStatistic({
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

    handlePrinterChange = (key, evt) => {
        const { printer } = this.state;

        printer[key] = evt.detail.value;
        this.setState({
            printer,
        });
    };

    handleChange = value => {
        const { model } = this.state;

        model.isMultiple = value;
        this.setState({
            model,
        });
    };

    handleSubmit = async () => {
        const { model } = this.state;
        const { userInfo } = this.props.loginStore;
        if (!+model.printCount) {
            Taro.showToast({
                icon: 'none',
                title: '?????????????????????',
            });
            return;
        }

        let res = await this.props.loginStore.printCode({
            printerId: userInfo?.id || '',
            count: model.printCount,
        });

        if (res?.code == 200) {
            Taro.showToast({
                icon: 'none',
                title: '????????????',
            });
        } else {
            Taro.showToast({
                icon: 'none',
                title: res?.message || '????????????',
            });
        }
    };

    navEdit = () => {
        Taro.navigateTo({
            url: '/pages/merchantRegist/index',
        });
    };

    handleAddPrinter = async () => {
        const { printer } = this.state;
        const { userInfo } = this.props.loginStore;

        if (!printer?.printerKey) {
            Taro.showToast({
                icon: 'none',
                title: '?????????key????????????',
            });
            return;
        }

        if (!printer?.printerSn) {
            Taro.showToast({
                icon: 'none',
                title: '?????????SN???????????????',
            });
            return;
        }

        Taro.showLoading({
            mask: true,
        });

        let method = this.props.loginStore.addPrinter;
        if (printer.id) {
            method = this.props.loginStore.modifyPrinter;
        }
        let res = await method({
            userId: userInfo?.id,
            userName: userInfo?.userName,
            ...printer,
        });

        Taro.hideLoading();

        if (res?.code == 200) {
            Taro.showToast({
                icon: 'none',
                title: '????????????',
            });
        } else {
            Taro.showToast({
                icon: 'none',
                title: res?.message || '????????????',
            });
        }
    };

    handleScan = () => {
        let _this = this;
        Taro.scanCode({
            async success(res) {
                if (res.errMsg !== 'scanCode:ok') {
                    Taro.showToast({
                        title: res.errMsg || '????????????',
                    });

                    return;
                }

                let data = res.result;
                if (data.indexOf(':') === -1) {
                    return;
                }
                let arr = data.split(':');

                _this.setState(
                    {
                        printer: {
                            printerSn: arr[0],
                            printerKey: arr[1],
                        },
                    },
                    _this.handleAddPrinter,
                );
            },
        });
    };
    render() {
        const { userInfo } = this.props.loginStore;
        const { model, statistic, printer } = this.state;
        return (
            <View className="orderApply">
                <SettingItem
                    title="????????????"
                    extraText={userInfo?.userName ?? '?????????'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="????????????"
                    extraText={userInfo?.phone ?? '?????????'}
                    arrow
                    bottomGap
                    onItemClick={this.navEdit}
                />
                {/* <SettingItem
                    title="?????????SN"
                    extraText={printer?.printerSn ?? '?????????'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="?????????Key"
                    extraText={printer?.printerKey ?? '?????????'}
                    bottomGap
                    arrow
                    onItemClick={this.navEdit}
                /> */}
                <View className="form-container">
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <View className="input-title">????????? sn</View>
                        <Input
                            className="zl-input"
                            placeholderClass="zl-input-placeholder"
                            name="printerSn"
                            value={printer.printerSn || ''}
                            placeholder="?????????SN???"
                            containerStyle={{ border: 'none' }}
                            onInput={this.handlePrinterChange.bind(this, 'printerSn')}
                        />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <View className="input-title">????????? key</View>
                        <Input
                            name="printerKey"
                            className="zl-input"
                            placeholderClass="zl-input-placeholder"
                            value={printer.printerKey || ''}
                            placeholder="??????????????????Key"
                            containerStyle={{ border: 'none' }}
                            onInput={this.handlePrinterChange.bind(this, 'printerKey')}
                        ></Input>
                    </View>
                    <View className="printer-box">
                        <View className="btn-apply" onClick={this.handleScan}>
                            ?????????????????????
                        </View>
                        <View className="btn-apply" onClick={this.handleAddPrinter}>
                            ???????????????
                        </View>
                    </View>
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
                                this.getStatistic,
                            );
                        }}
                    />
                </View>

                <SettingItem title="????????????" extraText={statistic['???????????????'] || '0'} />
                <SettingItem title="????????????" extraText={statistic['???????????????'] || '0'} bottomGap />
                <View className="form-container">
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <View className="input-title">????????????</View>
                        <Input
                            name="printCount"
                            className="zl-input"
                            placeholderClass="zl-input-placeholder"
                            value={model.printCount || ''}
                            placeholder="?????????????????????"
                            containerStyle={{ border: 'none' }}
                            onInput={this.handleParamsChange.bind(this, 'printCount')}
                        ></Input>
                    </View>
                    <View className="btn-apply" onClick={this.handleSubmit}>
                        ??????
                    </View>
                    <View
                        className="btn-detail"
                        onClick={() => {
                            Taro.navigateTo({
                                url: '/pages/merchantStatistic/index?userId=' + userInfo?.id,
                            });
                        }}
                    >
                        ??????????????????
                    </View>
                </View>
            </View>
        );
    }
}

export default Merchant;
