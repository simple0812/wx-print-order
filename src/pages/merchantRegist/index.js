import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Input, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
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
            model: {},
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
        if (!model?.merchantName) {
            Taro.showToast({
                icon: 'none',
                title: '商户名称不能为空',
            });
            return;
        }

        if (!model?.printKey) {
            Taro.showToast({
                icon: 'none',
                title: '打印机key不能为空',
            });
            return;
        }

        if (!model?.sn) {
            Taro.showToast({
                icon: 'none',
                title: '打印机SN码不能为空',
            });
            return;
        }

        Taro.showToast({
            icon: 'none',
            title: '注册成功',
        });

        await Promise.delay(500);

        Taro.navigateTo({
            url: '/pages/merchant/index',
        });
        return;

        Taro.showLoading({
            mask: true,
        });

        let res = await this.props.loginStore.merchantRegist({
            ...model,
        });

        Taro.hideLoading();

        if (res?.success) {
            Taro.showToast({
                icon: 'none',
                title: '注册成功',
            });
            await Promise.delay(500);

            Taro.navigateTo({
                url: '/pages/merchant/index',
            });
        } else {
            Taro.showToast({
                icon: 'none',
                title: res?.message || '注册失败',
            });
        }
    };
    render() {
        const { model } = this.state;
        return (
            <View className="orderApply">
                <View className="orderApply-bg" />
                <View className="form-container">
                    <Input
                        name="merchantName"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.merchantName || ''}
                        placeholder="请输入商户名称"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'merchantName')}
                    ></Input>
                    <Input
                        name="phone"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.phone || ''}
                        placeholder="请输入联系方式"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'phone')}
                    ></Input>
                    <Input
                        name="printKey"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.printKey || ''}
                        placeholder="请输入打印机Key"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'printKey')}
                    ></Input>
                    <Input
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        name="sn"
                        value={model.sn || ''}
                        placeholder="请输入SN码"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'sn')}
                    />
                    {/* <AtSwitch
                        className="isMultiple"
                        title="批量打印"
                        checked={this.state.isMultiple}
                        onChange={this.handleChange}
                    /> */}

                    <View className="btn-apply" onClick={this.handleSubmit}>
                        保存
                    </View>
                </View>
            </View>
        );
    }
}

export default Merchant;
