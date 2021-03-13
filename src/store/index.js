
import { configure } from 'mobx';
import globalStore from './global';
import productDetailStore from './productDetailStore';
import bookingStore from './bookingStore';

import loginStore from './login';


configure({
  enforceActions: 'always' // 严格模式
});

const stores = {
  globalStore,
  loginStore,
  bookingStore,
  productDetailStore
};

export default stores;
