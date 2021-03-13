import { observable, action, flow, runInAction } from 'mobx';
import service from '@/service/global';
import BaseStore from '@/store/BaseStore';

class GlobalStore extends BaseStore {
  @observable qiniuToken = '';

  constructor() {
    super(service, {
    });
  }

  @action getQiniuToken = async () => {
    if (this.qiniuToken) {
      return this.qiniuToken;
    }
    let { response } = await service.getQiniuToken() || {};

    runInAction(() => {
      if (response && response.data && response.data.upToken) {
        this.qiniuToken = response.data.upToken;
      }

    })
  };

}

export default new GlobalStore();
