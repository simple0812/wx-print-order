import BaseService, { getFn } from '@/service/BaseService';

class productDetailService extends BaseService {
  constructor() {
    super('', {
      getProductDetailInfo:getFn('/caseInfoDetail/getCaseInfoDetail.do'),
      addShareCount: '/caseInfoDetail/addShareCount.do'
    });
  }
}

export default new productDetailService();
