import BaseService, { getFn, postFn, putFn, deleteFn } from '@/service/BaseService';
import qs from 'query-string';
import request from '../utils/request.js';

const { get, post, put } = request;

class LoginService extends BaseService {
  constructor() {
    super('', {

      thirdLogin: ({code}) => {
        return get(`/wechat/login/${code}`)
      },
      addMerchant: postFn('/user/addSeller'),
      modifyMerchant: putFn('/user/modify'),
      addCustomer: postFn('/user/addStudent'),
      modifyUser: putFn('/user/modify'),

      getMerchantOrders: ({userId, ...rest}) => {
        return get(`/orderPrintLog/getOrderDetail/seller/${userId}`, {...rest})
      },
      getCustomerOrders: ({userId, ...rest}) => {
        return get(`/orderPrintLog/getOrderDetail/student/${userId}`,  {...rest})
      },

      customerStatistic: ({userId, ...rest}) => {
        return get(`/orderPrintLog/studentOrderCount/countByDate/${userId}`, {...rest})
      },
      merchantStatistic:({userId, ...rest}) => {
        return get(`/orderPrintLog/countByDate/${userId}`,  {...rest})
      },
      scanCode: (params) => {
        return put('/orderPrintLog/modify?' + qs.stringify(params || {}))
      },
      printCode: ({printerId, count}) => {
        return post(`/sellerPrinter/print/${printerId}/${count}`)
      },

      getPrinterByUserId: ({userId}) => {
        return get(`/sellerPrinter/getByUserId/${userId}`)
      },
      addPrinter: postFn(`/sellerPrinter/addPrinter`),

      getMerchantList: '/orderPrintLog/countAllSellerByDateRange',
      getCustomerList: '/orderPrintLog/countAllStudentByDateRange',

      exportData: '/poi/createExecl'
    });
  }
}

export default new LoginService();
