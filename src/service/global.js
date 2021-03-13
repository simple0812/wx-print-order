import BaseService, { getFn } from '@/service/BaseService';
import request from '../utils/request.js';

class GlobalService extends BaseService  {
  constructor() {
    super('', {
      getQiniuToken:(params) => {
        return request.get('/upload/getQiniuTokenWithParams', params, 'qiniu')
      }
    });
  }
  
}

export default new GlobalService();
