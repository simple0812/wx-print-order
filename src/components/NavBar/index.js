import Taro from '@tarojs/taro';
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components';
import './index.scss';

import extendSystemInfo from './extendSystemInfo';

let globalSystemInfo = extendSystemInfo();
class NavBar extends Component {
  
  static defaultProps = {
    extClass: '',
    background: 'rgba(255,255,255,1)', //导航栏背景
    color: '#000000',
    title: '住小咖',
    searchText: '点我搜索',
    searchBar: false,
    back: false,
    home: false,
    iconTheme: 'black',
    delta: 1,
  };
  // eslint-disable-next-line
  static options = {
    multipleSlots: true,
    addGlobalClass: true
  };

  constructor(props) {
    super(props);
    this.state = {
      configStyle: this.setStyle(globalSystemInfo)
    };
  }
  

  UNSAFE_componentWillMount () {
    //获取高度
    // let query = Taro.createSelectorQuery().in(this.$scope)
    // query.select('.lxy-nav-bar').boundingClientRect(rect=>{
    //   const navHeight = rect.height
    //   this.props.personalHomeMod.changeState('navHeight',navHeight)
    // 	// console.log('navHeight',toJS(this.props.personalHomeMod.state))
    // }).exec()

  }
  componentDidShow () {
    if (globalSystemInfo.ios) {
      globalSystemInfo = extendSystemInfo();
      this.setState({
        configStyle: this.setStyle(globalSystemInfo)
      });
    }
  }
  handleBackClick () {
    if (this.props.onBack) {
      this.props.onBack();
    } else {
     
      let pages = Taro.getCurrentPages().length
      if (pages <= 1) {
        Taro.reLaunch({
          url: `/pages/index/index`
        })
      }else{
        Taro.navigateBack()
      }
    }
  }
  handleGoHomeClick () {
    if (this.props.onHome) {
      this.props.onHome();
    }else {
      let pages = Taro.getCurrentPages().length
      if (pages <= 1) {

        Taro.reLaunch({
          url: `/pages/index/index`
        })
      }else{
        Taro.navigateBack({
          delta: pages
        })
      }
    }
  }
  handleSearchClick () {
    if (this.props.onSearch) {
      this.props.onSearch();
    }
  }
  

  setStyle (systemInfo) {
    const { statusBarHeight, navBarHeight, capsulePosition, navBarExtendHeight, ios, windowWidth } = systemInfo;
    const { back, home, title, color } = this.props;
    let rightDistance = windowWidth - capsulePosition.right; //胶囊按钮右侧到屏幕右侧的边距
    let leftWidth = windowWidth - capsulePosition.left; //胶囊按钮左侧到屏幕右侧的边距

    let navigationbarinnerStyle = [
      `color:${color}`,
      //`background:${background}`,
      `height:${navBarHeight + navBarExtendHeight}px`,
      `padding-top:${statusBarHeight}px`,
      `padding-right:${leftWidth}px`,
      `padding-bottom:${navBarExtendHeight}px`
    ].join(';');
    let navBarLeft;
    if ((back && !home) || (!back && home)) {
      navBarLeft = [
        `width:${capsulePosition.width}px`,
        `height:${capsulePosition.height}px`,
        `margin-left:0px`,
        `margin-right:${rightDistance}px`
      ].join(';');
    } else if ((back && home) || title) {
      navBarLeft = [
        `width:${capsulePosition.width}px`,
        `height:${capsulePosition.height}px`,
        `margin-left:${rightDistance}px`
      ].join(';');
    } else {
      navBarLeft = [`width:auto`, `margin-left:0px`].join(';');
    }
    return {
      navigationbarinnerStyle,
      navBarLeft,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      rightDistance
    };
  }

  render () {
    const {
      navigationbarinnerStyle,
      navBarLeft,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      rightDistance
    } = this.state.configStyle;
    const {
      title,
      background,
      backgroundColorTop,
      back,
      home,
      searchBar,
      searchText,
      iconTheme,
      extClass
    } = this.props;
    let nav_bar__center;
    if (title) {
      nav_bar__center = <Text>{title}</Text>;
    } else if (searchBar) {
      nav_bar__center = (
        <View
          className='lxy-nav-bar-search'
          style={`height:${capsulePosition.height}px;`}
          onClick={this.handleSearchClick.bind(this)}
        >
          <View className='lxy-nav-bar-search__icon' />
          <View className='lxy-nav-bar-search__input'>{searchText}</View>
          {/*<Image src={require('../../assets/icon_home.png')}/>*/}
        </View>
      );
    } else {
      /* eslint-disable */
      nav_bar__center = this.props.renderCenter;
      /* eslint-enable */
    }
    return (
      <View
        className={`lxy-nav-bar ${ios ? 'ios' : 'android'} ${extClass}`}
        style={`background: ${backgroundColorTop ? backgroundColorTop : background};height:${navBarHeight +
        navBarExtendHeight}px;`}
      >
        <View
          className={`lxy-nav-bar__placeholder ${ios ? 'ios' : 'android'}`}
          style={`padding-top: ${navBarHeight + navBarExtendHeight}px;`}
        />
        <View
          className={`lxy-nav-bar__inner ${ios ? 'ios' : 'android'}`}
          style={`background:${background};${navigationbarinnerStyle};`}
        >
          <View className='lxy-nav-bar__left' style={navBarLeft}>
            {back && !home && (
              <View
                onClick={this.handleBackClick.bind(this)}
                className={`lxy-nav-bar__button lxy-nav-bar__btn_goback ${iconTheme}`}
              />
            )}
            {!back && home && (
              <View
                onClick={this.handleGoHomeClick.bind(this)}
                className={`lxy-nav-bar__button lxy-nav-bar__btn_gohome ${iconTheme}`}
              />
            )}
            {back && home && (
              <View className={`lxy-nav-bar__buttons ${ios ? 'ios' : 'android'}`}>
                <View
                  onClick={this.handleBackClick.bind(this)}
                  className={`lxy-nav-bar__button lxy-nav-bar__btn_goback ${iconTheme}`}
                />
                <View
                  onClick={this.handleGoHomeClick.bind(this)}
                  className={`lxy-nav-bar__button lxy-nav-bar__btn_gohome ${iconTheme}}`}
                />
              </View>
            )}
            {!back && !home && this.props.renderLeft}
          </View>
          <View className='lxy-nav-bar__center' style={`padding-left: ${rightDistance}px`}>
            {nav_bar__center}
          </View>
          <View className='lxy-nav-bar__right' style={`margin-right: ${rightDistance}px`}>
            {this.props.renderRight}
          </View>
        </View>
      </View>
    );
  }
}

export default NavBar;
