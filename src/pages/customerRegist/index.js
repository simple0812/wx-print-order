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
        if (!model?.studentName) {
            Taro.showToast({
                icon: 'none',
                title: '学生名称不能为空',
            });
            return;
        }

        if (!model?.phone) {
            Taro.showToast({
                icon: 'none',
                title: '学生联系方式不能为空',
            });
            return;
        }

        Taro.showToast({
            icon: 'none',
            title: '注册成功',
        });

        await Promise.delay(500);
        Taro.navigateTo({
            url: '/pages/customer/index',
        });
        return;

        Taro.showLoading({
            mask: true,
        });

        let res = await this.props.loginStore.studentRegist({
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
                url: '/pages/customer/index',
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
                        name="studentName"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.studentName || ''}
                        placeholder="请输入学生名称"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'studentName')}
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
                        name="code"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.code || ''}
                        placeholder="请输入学号"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'code')}
                    ></Input>

                    <View className="btn-apply" onClick={this.handleSubmit}>
                        保存
                    </View>
                </View>
            </View>
        );
    }
}

export default Merchant;
