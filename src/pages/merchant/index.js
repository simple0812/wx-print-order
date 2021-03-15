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
        const { onSubmit } = this.props;
        const { model } = this.state;
        console.log('ddd', model)

        if (onSubmit) {
            onSubmit({
                ip: model.ip,
                sn: model.sn,
                isMultiple: model.isMultiple ? 1 : 0,
            });
        }

        let res = await this.props.loginStore.printCode({
            ip: model.ip,
            sn: model.sn,
            isMultiple: model.isMultiple ? 1 : 0,
        })

        if (res?.success) {
            Taro.showToast({
                icon: 'none',
                title: '打印成功'
            })
        } else {
            Taro.showToast({
                icon: 'none',
                title: res?.message || '打印失败'
            })
        }
    };
    render() {
        const { model } = this.state;
        return (
            <View className="orderApply">
                <View className="orderApply-bg" />
                <View className="form-container">
                    <Input
                        name="ip"
                        className="zl-input"
                        placeholderClass="zl-input-placeholder"
                        value={model.ip || ''}
                        placeholder="请输入IP地址"
                        containerStyle={{ border: 'none' }}
                        onInput={this.handleParamsChange.bind(this, 'ip')}
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
                    <AtSwitch
                        className="isMultiple"
                        title="批量打印"
                        checked={this.state.isMultiple}
                        onChange={this.handleChange}
                    />

                    <View className="btn-apply" onClick={this.handleSubmit}>
                        打印
                    </View>
                </View>
            </View>
        );
    }
}

export default Merchant;
