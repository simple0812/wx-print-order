import React, {Component} from 'react'
import {Provider} from 'mobx-react'
import Taro from '@tarojs/taro';
import '@/utils/_fix'
import store from '@/store'
import 'taro-ui/dist/style/index.scss';

import './app.scss'

if (Taro.getEnv() !== 'WEB' && process.env.HOST_ENV === 'production') {
  require('./utils/mtj-wx-sdk');
}

let _navigateTo = Taro.navigateTo;
let navigateTimeout = null;

console.log(`ENV NODE:${process.env.NODE_ENV}, HOST:${process.env.HOST_ENV}`)

//重写navigateTo 防止重复点击
Taro.navigateTo = function (...args) {
  if (navigateTimeout) {
    return;
  }

  navigateTimeout = setTimeout(() => {
    clearTimeout(navigateTimeout);
    navigateTimeout = null;
  }, 200)

  _navigateTo(...args)
}

class App extends Component {
  componentDidMount() {

    // if(Taro.getEnv() === 'WEB') {
    //   var hm = window.document.createElement("script");
    //   hm.src = "https://hm.baidu.com/hm.js?80aedf250e698fb74ce6990d184cb0d3";
    //   var s = window.document.getElementsByTagName("script")[0]; 
    //   s.parentNode.insertBefore(hm, s);
    // }
  }

  componentDidShow() {

  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  // this.props.children 就是要渲染的页面
  render() {
    return (
      <Provider {...store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
