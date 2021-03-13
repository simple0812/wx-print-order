import React, { useState } from 'react';
import { View, Picker } from '@tarojs/components';
import addressMap from '@/utils/addressMap';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

const CityPicker = (({ value, onChange, placeHolder } = {}) => {
  const [province, setProvince] = useState(0)
  const handleColChange = (evt) => {
    console.log('handleColChange change', evt)
    if (evt.detail.column == 0) {
      setProvince(evt.detail.value)
    }

  }

  const handleAddressChange = (evt) => {
    let xValue = evt.detail.value;
    if (!xValue || xValue.length !== 2) {
      return;
    }

    let provinceIndex = xValue[0];
    let cityIndex = xValue[1];
    let xProvince = addressMap[provinceIndex];
    if (isFunction(onChange)) {
      onChange([xProvince, xProvince.citys[cityIndex]])
    }
  }


  return (
    <Picker mode='multiSelector'
      style={{ flexGrow: 1, flexShrink: 1 }}
      range={[addressMap, addressMap[province].citys]}
      rangeKey='name'
      onChange={handleAddressChange}
      onColumnChange={handleColChange}>
      <View className='editor-item__input' style={{ width: '100%' }}>
        {
          !!value && !isEmpty(value) ? (
            <View>{`${get(value, '[0].name', '')}${value && value[1] ? '-' : ''}${get(value, '[1].name', '')}`}</View>
          ) : (
              <View style={{ color: '#999999'}}>{!!placeHolder ? placeHolder : '请选择籍贯'}</View>
            )
        }

      </View>
    </Picker>
  )
})
export default CityPicker;