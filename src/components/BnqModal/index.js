import React, { Component } from 'react';
import { View } from '@tarojs/components';
import { AtModal, AtButton } from 'taro-ui';

import './index.scss';

class BnqAuthModal extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    const { title, content, onClose, onOk, isOpened, openType, cancelText, okText, okButtonProps, cancelButtonProps, ...restProps } = this.props;
    return (
      <AtModal
        isOpened={isOpened}
        closeOnClickOverlay={false}
        className='bnq-modal'
        onClose={onClose}
        {...restProps}
      >
        <View className='bnq-modal__container'>
          <View className='bnq-modal__title'>{title}</View>
          <View className='bnq-modal__content'>{content}</View>
          <View className='bnq-modal__footer'>
            <View className='btn-container' >
              <AtButton
                className='btn-buth btn-close'
                onClick={onClose}
                {...cancelButtonProps}
              >
                {cancelText || '取消'}
              </AtButton>
            </View>
            <View className='btn-container'>
              <AtButton
                className='btn-buth btn-ok'
                openType={openType}
                onClick={onOk}
                {...okButtonProps}
              >
                {okText || '确定'}
              </AtButton>
            </View>
          </View>
        </View>
      </AtModal>
    );
  }
}

export default BnqAuthModal;