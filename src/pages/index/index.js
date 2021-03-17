import React, { Component } from 'react';
import { Button, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import isEmpty from 'lodash/isEmpty';
import { inject, observer } from 'mobx-react';
import taroFnToPromise from '@/utils/taroFnToPromise';
import { userTypeEnum } from '@/utils/systemEnum';
import './index.less';

@inject(store => {
    return {
        loginStore: store.loginStore,
    };
})
@observer
class IndexPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.initData();
    }

    componentWillUnmount() {}

    onShareAppMessage = res => {
        return {};
    };

    initData = async () => {
        let userRes = await this.props.loginStore.tryGetUserInfo();
        if (!userRes?.result?.id) {
            return;
        }
        // 如果登录成功了额 根据用户类型自动跳转页面
        if (userRes?.result?.userType == userTypeEnum.CUSTOMER) {
            Taro.navigateTo({
                url: '/pages/customer/index',
            });
        } else if (userRes?.result?.userType == userTypeEnum.MERCHANT) {
            Taro.navigateTo({
                url: '/pages/merchant/index',
            });
        }
    };

    handleGetWxPhoneNumber = async (type, res) => {
        if (res?.detail?.errMsg !== 'getPhoneNumber:ok') {
            Taro.showToast({
                icon: 'none',
                title: '获取微信手机号失败',
            });
            return;
        }

        Taro.showLoading({
            mask: true,
        });

        let wxLoginCode = Taro.getStorageSync('wx_login_code') || '';
        let sessionRes = await taroFnToPromise(Taro.checkSession)().catch(() => null);
        // 强制重新获取code
        if (sessionRes?.errMsg !== 'checkSession:ok') {
            console.log('强制重新获取code');
            let xRes = await taroFnToPromise(Taro.login)();

            if (!xRes?.code) {
                Taro.showToast({
                    icon: 'none',
                    title: '微信登录失败，请稍后重试',
                });
                Taro.hideLoading();
                return;
            }
            wxLoginCode = xRes.code;
            Taro.setStorageSync('wx_login_code', xRes.code);
        }

        let wxPhoneData = res.detail;

        const data = {
            encryptedData: '',
            iv: '',
            signature: '',
            rawData: '',

            encryptedData_phone: wxPhoneData?.encryptedData,
            iv_phone: wxPhoneData?.iv,
            code: wxLoginCode,
            idStr: Taro.getStorageSync('login_id_str'),
        };

        try {
            let res = await this.props.loginStore.thirdBind(data);
            Taro.hideLoading();

            if (res && res.code == 200) {
                Taro.showToast({
                    icon: 'none',
                    title: '注册成功',
                });

                this.initData();
            } else {
                Taro.showToast({
                    icon: 'none',
                    title: res?.message || '登录失败',
                });
            }
        } catch (e) {
            Taro.hideLoading();
        }
    };

    merchantRegist = () => {
        Taro.navigateTo({
            url: '/pages/merchantRegist/index',
        });
    };

    customerRegist = () => {
        Taro.navigateTo({
            url: '/pages/customerRegist/index',
        });
    };

    render() {
        const { userInfo } = this.props.loginStore;
        return (
            <View className="indexPage">
                <Button
                    className="btn-entrance"
                    onClick={() => {
                        if (!userInfo?.id) {
                            this.merchantRegist();
                            return;
                        }
                        Taro.navigateTo({
                            url: '/pages/merchant/index',
                        });
                    }}
                >
                    商家入口
                </Button>
                <Button
                    className="btn-entrance"
                    onClick={() => {
                        if (!userInfo?.id) {
                            this.customerRegist();
                            return;
                        }

                        Taro.navigateTo({
                            url: '/pages/customer/index',
                        });
                    }}
                >
                    学生入口
                </Button>
            </View>
        );
    }
}

export default IndexPage;
