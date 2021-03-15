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

        if (!model.merchantName) {
            Taro.showToast({
                icon: 'none',
                title: '商家名称不能为空',
            });
            return;
        }

     

        if (onSubmit) {
            onSubmit({
                merchantName: model.merchantName,
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
                        name="merchantName"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.merchantName || ''}
                        placeholder="请输入商家名称"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'merchantName')}
                    ></Input>

                    <View className="btn-apply" onClick={this.handleSubmit}>
                        <Image src={require('../assets/baoming.png')} mode="widthFix" className="bm-txt" />
                    </View>
                </View>
            </View>
        );
    }
}

export default OrderApply;
