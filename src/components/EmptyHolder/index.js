import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import cn from 'classnames';
import isFunction from 'lodash/isFunction'

import './index.scss';
import emptyImgPng from './assets/empty.png';

const localClass = 'abc-empty-holder';

class EmptyHolder extends Component {
  static propTypes = {
    comStyle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    placeholder: PropTypes.string, 
  }

  static defaultProps = {
    placeholder: '暂无内容'
  }
  
  constructor(props) {
    super(props);
    this.state = {  }
  }
 
  handleRefresh = (evt) => {
    const { onRefresh } = this.props

    if (isFunction(onRefresh)) {
      onRefresh(evt, () => {})
    }
  }

  //兼容小程序和h5的class写法
  render() { 
    const { style, placeholder, emptyImg} = this.props
    

    return ( 
      <View className={cn('com-class', localClass, this.props.className)} style={style}>

        <Image src={emptyImg || emptyImgPng} className={`${localClass}-img`} mode='widthFix' />
        <View className={`${localClass}-text`}>
          { placeholder }
          { this.props.renderPlacehodler }
        </View>
      </View>
    );
  }
}
 
export default EmptyHolder;
