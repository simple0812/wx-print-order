import {observable, action, flow, toJS} from 'mobx';
import service from '@/service/productDetailService'
import BaseStore from '@/store/BaseStore';
import Taro from "@tarojs/taro";

class productDetailStore extends BaseStore {

  @observable productDetailInfo = {};

  constructor() {
    super(service, {});
  }

  getProductDetailInfo = flow(function* genex({productId, preview}) {
    let xParams = {
      infoId: productId
    }
    if (preview) {
      xParams.preview = 1;
    }
    let res = yield service.getProductDetailInfo(xParams);
    if (res && res.data) {
      this.productDetailInfo = { ...res.data };
    }else{
      this.productDetailInfo = {};
    }
  }).bind(this);

}

export default new productDetailStore();
