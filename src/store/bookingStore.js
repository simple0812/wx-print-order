import service from '@/service/booking';
import BaseStore from '@/store/BaseStore';
import { observable, action, flow } from 'mobx';
import Taro from "@tarojs/taro";

class BookingStore extends BaseStore {

  @observable bookingList = [];
  @observable loading = false;
  @observable hasMore = true;
  @observable pageIndex = 1;
  @observable foremanCode = '';
  @observable followTypes = [];

  constructor() {
    super(service, {
    });
  }

  getFollowTypes = flow(function* genex(params) {
    
    let res = yield service.getFollowTypes();
    if (res && res.data) { 
      console.log('========>>',res.data)
      this.followTypes = [...res.data]
      console.log('========>>',this.followTypes)
    }
    return res;
  }).bind(this);

  setForemanCode = flow(function* genex(params) {
    this.foremanCode = params?.foremanCode;
  }).bind(this);

  addBooking = flow(function* genex(params) {
    if (this.loading) {
      return
    }
    this.loading = true;
    let res = yield service.addBooking(params);
    this.loading = false;
    return res;
  }).bind(this);

  followUp = flow(function* genex(params) {
    if (this.loading) {
      return
    }
    this.loading = true;
    let res = yield service.followUp(params);
    this.loading = false;
    return res;
  }).bind(this);

  submitRemark = flow(function* genex(params) {
    if (this.loading) {
      return
    }
    this.loading = true;
    let res = yield service.remark(params);
    this.loading = false;
    return res;
  }).bind(this);


  getBookingList = flow(function* genex(params) {

    if (this.loading) {
      return
    }
    this.loading = true;
    this.pageIndex = params?.isLoadMore ? this.pageIndex + 1 : 1
    this.showType = params?.showType
    let requestParams = {
      showType: this.showType,
      pageSize: 10,
      pageNum: this.pageIndex,
      foremanCode: this.foremanCode
    }
    let res = yield service.bookings(requestParams);
    console.log('-------获取到的booking列表详情：', res)
    if (res && res.data) {
      // this.hasMore = res.data.list.length != 0
      this.hasMore = !res.data.isLastPage

      console.log('------',res.data.isLastPage)

      if (this.pageIndex === 1) {
        this.bookingList = [...res.data.list]
      } else {
        this.bookingList = [...this.bookingList, ...res.data.list]
      }
    }
    this.loading = false;
    return res;
  }).bind(this);

}

export default new BookingStore();