import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Input, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SettingItem from '@/components/SettingItem';
import { AtSwitch } from 'taro-ui';
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
            model: {
                printCount: 1,
            },
        };
    }

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

    handleSubmit = async () => {
        const { model } = this.state;
        if (!+model.printCount) {
            Taro.showToast({
                icon: 'none',
                title: '请输入打印数量',
            });
            return;
        }

        let res = await this.props.loginStore.printCode({
            printCount: model.printCount,
        });

        if (res?.success) {
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
        Taro.navigateTo({
            url: '/pages/merchantRegist/index',
        });
    };
    render() {
        const { model } = this.state;
        return (
            <View className="orderApply">
                <SettingItem
                    title="商户名称"
                    extraText={model?.realName ?? '未填写'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="联系方式"
                    extraText={model?.realName ?? '未填写'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="打印机SN"
                    extraText={model?.realName ?? '未填写'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="打印机Key"
                    extraText={model?.realName ?? '未填写'}
                    bottomGap
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem title="已接单数" extraText={model?.realName ?? '0'} />
                <SettingItem title="已打印数" extraText={model?.realName ?? '0'} bottomGap />
                <View className="form-container">
                    <Input
                        name="printCount"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.printCount || ''}
                        placeholder="打印数量"
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
                                url: '/pages/merchantStatistic/index',
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
