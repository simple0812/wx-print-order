import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Input, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SettingItem from '@/components/SettingItem'
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
                printCount: 1
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

    scanCode = () => {
        Taro.scanCode({
            async success(res) {
                if (res.errMsg !== 'scanCode:ok') {
                    Taro.showToast({
                        title: res.errMsg || '扫码失败',
                    });

                    return;
                }

                let data = res.result;

                let dRes = await this.props.loginStore.scanCode({ data });
                if (dRes?.success) {
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
        Taro.navigateTo({
            url: '/pages/customerRegist/index'
        })
    }
    render() {
        const { model } = this.state;
        return (
            <View className="orderApply">
                 <SettingItem title="学生名称" extraText={model?.realName??'未填写'} arrow onItemClick={this.navEdit} />
                 <SettingItem title="联系方式" extraText={model?.realName??'未填写'} arrow onItemClick={this.navEdit} />
                 <SettingItem title="学号" extraText={model?.realName??'未填写'}  bottomGap  arrow onItemClick={this.navEdit} />
                <View className="form-container">
                    <View className="btn-apply" onClick={this.scanCode}>
                        打印
                    </View>
                    <View className="btn-detail" onClick={() => {
                        Taro.navigateTo({
                            url: '/pages/customerStatistic/index'
                        })
                    }}>
                        查看学生统计
                    </View>
                </View>
            </View>
        );
    }
}

export default Merchant;
