import BaseService, { getFn, postFn } from '@/service/BaseService';

class LoginService extends BaseService {
  constructor() {
    super('', {
      checkLogin: getFn('/login/checkLogin.do'),
      getUserInfo: getFn('/designer/userHome.do'),
      thirdLogin: getFn('/login/designerThirdLogin'),
      thirdBind: postFn('/login/designerThirdBind'),
      getRealMobile: postFn('/login/getRealMobile')
    });
  }
}

export default new LoginService();
