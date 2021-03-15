import React, { Component } from 'react';
import { View, Input, Image, Button } from '@tarojs/components';
import BnqPicker from '@/components/BnqPicker';
import Taro from '@tarojs/taro';
import FormItem from '@/components/FormItem';

import './index.less';

class OrderApply extends Component {
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

    handleSubmit = () => {
        const { onSubmit } = this.props;
        const { model } = this.state;

        if (!model.xCustomerName) {
            Taro.showToast({
                icon: 'none',
                title: '姓名不能为空',
            });
            return;
        }

        if (!model.XMobile) {
            Taro.showToast({
                icon: 'none',
                title: '手机号不能为空',
            });
            return;
        }

        let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!reg.test(model.XMobile)) {
            Taro.showToast({
                icon: 'none',
                title: '手机号格式不正确'
            })
            return;
        }

        if (onSubmit) {
            onSubmit({
                customerName: model.xCustomerName,
                mobile: model.XMobile,
            });
        }
    };
    render() {
        const { model } = this.state;
        return (
            <View className="orderApply">
                <View className="orderApply-bg" />
                <View className="form-container">
                    <Image className="orderApply-title" mode="widthFix" src={require('../assets/order-apply.png')} />
                    <Input
                        name="xCustomerName"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.xCustomerName || ''}
                        placeholder="请输入您的姓名"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'xCustomerName')}
                    ></Input>
                    <Input
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        name="XMobile"
                        value={model.XMobile || ''}
                        placeholder="请输入手机号"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'XMobile')}
                    />

                    <View className="btn-apply" onClick={this.handleSubmit}>
                        <Image src={require('../assets/baoming.png')} mode="widthFix" className="bm-txt" />
                    </View>
                    <View className="orderApply-desc">百安居承诺：您的隐私信息，不会泄露给任何第三方</View>
                </View>
            </View>
        );
    }
}

export default OrderApply;
