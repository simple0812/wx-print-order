import BaseService, { getFn, postFn } from '@/service/BaseService';

class LoginService extends BaseService {
  constructor() {
    super('', {
      getUserInfo: getFn('/designer/userHome.do'),
      thirdLogin: getFn('/login/designerThirdLogin'),
      thirdBind: postFn('/login/designerThirdBind'),
      getRealMobile: postFn('/login/getRealMobile'),

      studentRegist: postFn('/login/studentRegist'),
      merchantRegist: postFn('/login/merchantRegist'),

      getOrderList: postFn('/login/getOrderList'),
      scanCode: postFn('/login/scanCode'),
      printCode: postFn('/login/printCode'),
    });
  }
}

export default new LoginService();
