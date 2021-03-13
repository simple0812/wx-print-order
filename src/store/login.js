import Taro from '@tarojs/taro';
import service from '@/service/login';
import BaseStore from '@/store/BaseStore';
import get from 'lodash/get';
import taroFnToPromise from '@/utils/taroFnToPromise';
import { observable, action, flow, runInAction } from 'mobx';

class LoginStore extends BaseStore {
    @observable loginData = {};
    @observable userInfo = {};

    constructor() {
        super(service, {});
    }

    getUserInfo = flow(function* genex(params) {
        let res = yield service.getUserInfo(params);
        this.userInfo = res?.data || {};
        return res;
    }).bind(this);

    tryGetUserInfo = flow(function* genex() {
        let userRes = yield this.getUserInfo();

        if (userRes?.success) {
            return userRes;
        }

        // 登录失败后 重新登录
        let xRes = yield taroFnToPromise(Taro.login)();
        if (!xRes?.code) {
            this.userInfo = {};
            Taro.showToast({
                icon: 'none',
                title: '获取微信code失败',
            });
            return userRes;
        }

        Taro.setStorageSync('wx_login_code', xRes.code);
        let loginRes = yield this.thirdLogin({ code: xRes?.code });
        // 重新登录成功后 再次尝试获取用户信息
        if (loginRes?.data?.token) {
            let repeatRes = yield this.getUserInfo();

            return repeatRes;
        }

        return userRes;
    });

    thirdLogin = flow(function* genex(params) {
        Taro.removeStorageSync('login_id_str');
        let res = yield service.thirdLogin(params);

        if (res && res.data && res.data.token) {
            this.loginData = { ...res.data, isLogin: true };
            Taro.setStorageSync('sessionToken', res.data.token);
        } else {
            Taro.setStorageSync('login_id_str', res?.data?.idStr);
            this.loginData = {
                ...this.loginData,
                ...get(res, 'data'),
                isLogin: false,
            };

            if (!res?.success) {
                Taro.showToast({
                    icon: 'none',
                    title: '登录异常',
                });

                if (res?.message.indexOf('errcode=40029') >= 0) {
                    Taro.login({
                        success(res) {
                            Taro.setStorageSync('wx_login_code', res?.code);
                        },
                    });
                }
            }
        }
        return res;
    }).bind(this);

    thirdBind = flow(function* genex(params) {
        let res = yield service.thirdBind(params);

        if (res && res.data && res.data.token) {
            this.loginData = { ...res.data, isLogin: true };
            Taro.setStorageSync('sessionToken', res.data.token);
        } else {
            this.loginData = {
                ...this.loginData,
                isLogin: false,
            };
            Taro.showToast({
                icon: 'none',
                title: get(res, 'data.message') || '未知错误',
            });

            if (res?.message.indexOf('errcode=40029') >= 0) {
                Taro.login({
                    success(res) {
                        Taro.setStorageSync('wx_login_code', res?.code);
                    },
                });
            }
        }

        return res;
    }).bind(this);
}

export default new LoginStore();
