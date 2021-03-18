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
        
        this.getStatistic()
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
    }

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
                title: '请输入打印数量',
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
                title: '打印成功',
            });
        } else {
            Taro.showToast({
                icon: 'none',
                title: res?.message || '打印失败',
            });
        }
    };

    navEdit = () => {
        // Taro.navigateTo({
        //     url: '/pages/merchantRegist/index',
        // });
    };

    handleAddPrinter = async () => {
        const { printer } = this.state;
        const { userInfo } = this.props.loginStore;

        if (!printer?.printerKey) {
            Taro.showToast({
                icon: 'none',
                title: '打印机key不能为空',
            });
            return;
        }

        if (!printer?.printerSn) {
            Taro.showToast({
                icon: 'none',
                title: '打印机SN码不能为空',
            });
            return;
        }

        Taro.showLoading({
            mask: true,
        });
        let res = await this.props.loginStore.addPrinter({
            userId: userInfo?.id,
            userName: userInfo?.userName,
            ...printer,
        });

        Taro.hideLoading();

        if (res?.code == 200) {
            Taro.showToast({
                icon: 'none',
                title: '保存成功',
            });
        } else {
            Taro.showToast({
                icon: 'none',
                title: res?.message || '保存失败',
            });
        }
    };
    render() {
        const { userInfo } = this.props.loginStore;
        const { model, statistic, printer } = this.state;
        return (
            <View className="orderApply">
                <SettingItem
                    title="商户名称"
                    extraText={userInfo?.userName ?? '未填写'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="联系方式"
                    extraText={userInfo?.phone ?? '未填写'}
                    arrow
                    bottomGap
                    onItemClick={this.navEdit}
                />
                {/* <SettingItem
                    title="打印机SN"
                    extraText={printer?.printerSn ?? '未填写'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="打印机Key"
                    extraText={printer?.printerKey ?? '未填写'}
                    bottomGap
                    arrow
                    onItemClick={this.navEdit}
                /> */}
                <View className="form-container">
                    <View className="input-title">打印机 sn</View>
                    <Input
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        name="printerSn"
                        value={printer.printerSn || ''}
                        placeholder="请输入SN码"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handlePrinterChange.bind(this, 'printerSn')}
                    />
                    <View className="input-title">打印机 key</View>
                    <Input
                        name="printerKey"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={printer.printerKey || ''}
                        placeholder="请输入打印机Key"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handlePrinterChange.bind(this, 'printerKey')}
                    ></Input>
                    <View className="btn-apply" onClick={this.handleAddPrinter}>
                        添加打印机
                    </View>
                </View>
                <View>
                    <AtTabs
                        current={this.state.dateType}
                        tabList={dateTypes}
                        onClick={curr => {
                            this.setState({
                                dateType: curr,
                            }, this.getStatistic);
                        }}
                    />
                </View>

                <SettingItem title="已接单数" extraText={statistic['已派送单数'] || '0'} />
                <SettingItem title="已打印数" extraText={statistic['总打印单数'] || '0'} bottomGap />
                <View className="form-container">
                    <View className="input-title">打印数量</View>
                    <Input
                        name="printCount"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.printCount || ''}
                        placeholder="请输入打印数量"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'printCount')}
                    ></Input>

                    <View className="btn-apply" onClick={this.handleSubmit}>
                        打印
                    </View>
                    <View
                        className="btn-detail"
                        onClick={() => {
                            Taro.navigateTo({
                                url: '/pages/merchantStatistic/index?userId=' + userInfo?.id,
                            });
                        }}
                    >
                        查看商户统计
                    </View>
                </View>
            </View>
        );
    }
}

export default Merchant;
