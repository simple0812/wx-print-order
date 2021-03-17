import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Input, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
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
        if (!model?.userName) {
            Taro.showToast({
                icon: 'none',
                title: '商户名称不能为空',
            });
            return;
        }

        Taro.showLoading({
            mask: true,
        });
        let res = await this.props.loginStore.addMerchant({
            userWechatOpenid: this.props.loginStore?.userInfo?.userWechatOpenid || '',
            userType: 0,
            ...model,
        });

        Taro.hideLoading();

        if (res?.code == 200) {
            Taro.showToast({
                icon: 'none',
                title: '保存成功',
            });
            await Promise.delay(500);

            Taro.navigateTo({
                url: '/pages/merchant/index',
            });
        } else {
            Taro.showToast({
                icon: 'none',
                title: res?.message || '保存失败',
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
                        name="userName"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.userName || ''}
                        placeholder="请输入商户名称"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'userName')}
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
                    

                    <View className="btn-apply" onClick={this.handleSubmit}>
                        保存
                    </View>
                </View>
            </View>
        );
    }
}

export default Merchant;
