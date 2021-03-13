import BaseService, { getFn, postFn } from '@/service/BaseService';

class DesignerService extends BaseService {
  constructor() {
    super('', {
      getUserInfoByCode: getFn('/designer/info.do'),
      getCaseList: postFn('/designer/designerCaseList.do'),
    });
  }
}

export default new DesignerService();
