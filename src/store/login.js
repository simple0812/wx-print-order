import Taro from '@tarojs/taro';
import service from '@/service/login';
import BaseStore from '@/store/BaseStore';
import get from 'lodash/get';
import taroFnToPromise from '@/utils/taroFnToPromise';
import { observable, action, flow, runInAction } from 'mobx';

class LoginStore extends BaseStore {
    @observable userInfo = {};

    constructor() {
        super(service, {});
    }


    tryGetUserInfo = flow(function* genex() {
        let xRes = yield taroFnToPromise(Taro.login)();
        if (!xRes?.code) {
            this.userInfo = {};
            Taro.showToast({
                icon: 'none',
                title: '获取微信code失败',
            });
            return {};
        }

        Taro.setStorageSync('wx_login_code', xRes.code);
        let loginRes = yield service.thirdLogin({ code: xRes?.code });

        if (loginRes?.code == 201 || loginRes?.code == 200) {
            Taro.setStorageSync('sessionToken', loginRes?.result?.token);
            this.userInfo = loginRes?.result || {};
        } else {
            Taro.setStorageSync('sessionToken', '');
            Taro.showToast({
                icon: 'none',
                title: '登录异常',
            });
        }

        return loginRes;
    });


    addCustomer = flow(function* genx(params) {
        let res = yield service.addCustomer(params);
        this.userInfo = res?.result || {}

        return res;
    })

    addMerchant = flow(function* genx(params) {
        let res = yield service.addMerchant(params);
        this.userInfo = res?.result || {}
        return res;
    })
}

export default new LoginStore();
