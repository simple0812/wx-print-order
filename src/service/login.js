import BaseService, { getFn, postFn, putFn, deleteFn } from '@/service/BaseService';
import request from '../utils/request.js';

const { get, post, put } = request;

class LoginService extends BaseService {
  constructor() {
    super('', {

      thirdLogin: ({code}) => {
        return get(`/wechat/login/${code}`)
      },
      addMerchant: postFn('/user/addSeller'),
      addCustomer: postFn('/user/addStudent'),
      modifyUser: putFn('/user/modify'),

      getMerchantOrders: ({userId, ...rest}) => {
        return get(`/orderPrintLog/getOrderDetail/seller/${userId}`, {...rest})
      },
      getCustomerOrders: ({userId, ...rest}) => {
        return get(`/orderPrintLog/getOrderDetail/student/${userId}`,  {...rest})
      },

      customerStatistic: ({userId, ...rest}) => {
        return get(`/studentOrderCount/countByDate/${userId}`, {...rest})
      },
      merchantStatistic:({userId, ...rest}) => {
        return get(`/orderPrintLog/countByDate/${userId}`,  {...rest})
      },
      scanCode: putFn('/orderPrintLog/modify'),
      printCode: ({printerId, count}) => {
        return post(`/sellerPrinter/print/${printerId}/${count}`)
      },
    });
  }
}

export default new LoginService();
