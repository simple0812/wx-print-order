import React from 'react';
import { View, Image, Text } from '@tarojs/components';
import { thumbnailImage } from '@/utils/utils';
import { getScaleSize } from '@/utils'
import BnqImage from '@/components/BnqImage';
import Taro from '@tarojs/taro'

import './index.scss';

//获取图片缩放后的大小


const ProductCard = (props) => {
  const { data = {} } = props;

  let roomStr = data?.caseHouseTypeName ?? '';
  let areaStr = data?.caseSize ? Math.round(data.caseSize) : '0';
  let provinceStr = data?.caseProvinceName ?? '';
  let cityStr = data?.caseCityName ?? '';
  if (provinceStr === cityStr) {
    cityStr = ''
  }

  let size = getScaleSize({
    width: data.imgWidth,
    height: data.imgHeight
  }, 167)


  return (
    <View className='product-card' onClick={() => {
      Taro.navigateTo({
        url: '/pages/detail/index?id=' + data?.id
      })
    }}>
      <View className='item-portrait-content' style={{ width: size.width + 'px', height: size.height + 'px' }}>
        <BnqImage containerStyle={{ height: '100%' }} className='portrait-image' mode='widthFix' src={thumbnailImage(data.coverImg || '', { quality: 60 })} />
      </View>
      <View className='item-card-bottomContainer'>
        <Text className='item-tagDes'>{`${roomStr} · ${areaStr}`}m<Text className='info-sup' >2</Text>{`· ${provinceStr}${cityStr}`}</Text>
        <Text className='item-detailDes'>{data.caseTitle || ''}</Text>

      </View>

      <View className='card-statistic'>
        <View className="card-statistic-item">
          <Image className='card-statistic-item__icon' src={require('../assets/read-ico.png')} />
          <Text className='card-statistic-item__text'>20</Text>
        </View>
        <View className="card-statistic-item">
          <Image className='card-statistic-item__icon' src={require('../assets/share-ico.png')} />
          <Text className='card-statistic-item__text'>20</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
