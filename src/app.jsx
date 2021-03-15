import React, {Component} from 'react'
import {Provider} from 'mobx-react'
import Taro from '@tarojs/taro';
import '@/utils/_fix'
import store from '@/store'
import 'taro-ui/dist/style/index.scss';

import './app.scss'

let _navigateTo = Taro.navigateTo;
let navigateTimeout = null;

console.log(`ENV NODE:${process.env.NODE_ENV}, HOST:${process.env.HOST_ENV}`)

if (!Promise.delay) {
  Promise.delay = function(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms || 100);
    })
  }
}

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
