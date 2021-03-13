import React from 'react';
import isFunction from 'lodash/isFunction';
import find from 'lodash/findIndex';
import { View, Picker } from '@tarojs/components';

const BnqPicker = (({ value, onChange, placeholder, title, dataSource, rangeKey, style } = {}) => {

  const handleChange = (evt) => {
    if (isFunction(onChange)) {
      let xIndex = evt.detail.value;
      onChange((dataSource || [])[xIndex]?.id)
    }
  }
  let curr = (dataSource || []).find(each => each.id === value) || {};

  return (
    <Picker mode='selector'
      title={title}
      style={{ flexGrow: 1, flexShrink: 1 }}
      range={dataSource || []}
      rangeKey={rangeKey}
      value={curr}
      onChange={handleChange}
    >
      <View className='editor-item__input' style={{ width: '100%', ...style }}>
        {
          value ? (
            <View>{curr?.name}</View>
          ) : (
              <View style={{ color: '#999999' }}>{placeholder || '请选择'}</View>
            )
        }
      </View>
    </Picker>
  )
})
export default BnqPicker;