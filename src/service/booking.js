import BaseService, { getFn, postFn } from '@/service/BaseService';
import request from '../utils/request.js';

class BookingService extends BaseService {
  constructor() {
    super('', {
      bookings: postFn('/preappoint/pageList.do'),
      remark: postFn('/preappoint/remark.do'),
      getFollowTypes: getFn('/preappoint/followUpList.do'),
      addBooking: postFn('/preappoint/add.do'),
      followUp:postFn('/preappoint/followUp.do')
    });
  }
}

export default new BookingService();
