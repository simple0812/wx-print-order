import React from 'react';
import Taro from '@tarojs/taro';
import isFunction from 'lodash/isFunction';
import cn from 'classnames';
import { View } from '@tarojs/components';
import  authHelper from '@/utils/authHelper';
import { getCityCode } from '@/utils/addressMap'

import './index.scss';

const MapPicker = (({ value, onChange, className } = {}) => {

  const showMap = () => {
    Taro.chooseLocation({
      success(res) {
        if (isFunction(onChange)) {
          console.log('address', getCityCode(res.address), res)
          onChange(res)
        }
      },
      fail() {
        authHelper('scope.userLocation').catch(() => {
          console.log('打开设置失败')
        })
      }
    })
  }
  return (
    <View onClick={showMap} className={cn(className, 'map-picker')}>
      {
        value ? (
          <View>
            <View className='map-picker__name'>{value?.name}</View>
            <View  className='map-picker__address'>{value?.address}</View>
          </View>
        ) : (
            <View className='map-picker__placeholder'>请选择地址</View>
          )
      }
    </View>
  )
})
export default MapPicker;