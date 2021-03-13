import Taro from '@tarojs/taro';
import service from '@/service/foremanCircleService';

export default function (authType, tip) {
    return new Promise((resolve, reject) => {
        Taro.getSetting({
            success(res) {
                if (!res.authSetting[authType]) {
                    Taro.authorize({
                        scope: authType,
                        success() {
                            resolve('ok');
                        },
                        fail() {
                            Taro.showModal({
                                content: tip || '未检测到授权，是否去设置打开？',
                                confirmText: '确认',
                                cancelText: '取消',
                                success: function () {
                                    if (res.confirm) {
                                        Taro.openSetting({
                                            success: () => {
                                                reject();
                                                console.log('open setting success');
                                            },
                                            fail() {
                                                reject();
                                                console.log('open setting fail');
                                            },
                                        });
                                    } else {
                                        reject();
                                    }
                                },
                            });
                        },
                    });
                } else {
                    resolve('ok');
                }
            },
        });
    });
}

export async function checkIsLogin() {
    let sessionToken = Taro.getStorageSync('sessionToken');
    let xCode = Taro.getStorageSync('wx_login_code');

    console.log('sessionToken', sessionToken, '|', xCode);
    if (!sessionToken || !xCode) {
        Taro.removeStorageSync('sessionToken');
        Taro.removeStorageSync('wx_login_code');
        Taro.removeStorageSync('login_id_str', '')
        return false;
    }

    // 如果存在sessiontoken 通过是否能够获取到用户信息来判断是否过期
    let res = await service.getForemanInfo();
    if (res?.data?.foremanCode) {
        return res;
    } else {
        Taro.removeStorageSync('sessionToken');
        Taro.removeStorageSync('wx_login_code');
        Taro.removeStorageSync('login_id_str', '')
        return false;
    }
}
