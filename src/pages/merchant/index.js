import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Input, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SettingItem from '@/components/SettingItem';
import dateFormat from '@/utils/dateFormat'
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
            statistic: {},
        };
    }

    componentDidMount() {
        const { userInfo } = this.props.loginStore;
        let now = new Date();
        this.props.loginStore.merchantStatistic({
            start: dateFormat('YYYY-mm-dd 00:00:00', now),
            end: dateFormat('YYYY-mm-dd 23:59:59', now),
            userId: userInfo?.id,
        }).then(res => {
            if (res?.code ===200) {
                this.setState({
                    statistic: res?.result
                })
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
        // Taro.navigateTo({
        //     url: '/pages/merchantRegist/index',
        // });
    };
    render() {
        const { userInfo } = this.props.loginStore;
        const { model, statistic } = this.state;
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
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="打印机SN"
                    extraText={userInfo?.printSn ?? '未填写'}
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem
                    title="打印机Key"
                    extraText={userInfo?.printKey ?? '未填写'}
                    bottomGap
                    arrow
                    onItemClick={this.navEdit}
                />
                <SettingItem title="已接单数" extraText={statistic['已派送单数'] || '0'} />
                <SettingItem title="已打印数" extraText={statistic['总打印单数'] || '0'} bottomGap />
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
