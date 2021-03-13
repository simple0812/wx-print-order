export default {
  pages: [
    'pages/index/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarTitleText: '设计师',
    enablePullDownRefresh: false,
    enableShareAppMessage: true,
    navigationBarBackgroundColor: '#2A2A2A',
    navigationBarTextStyle: 'white'
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序相关功能'
    }
  }
}
