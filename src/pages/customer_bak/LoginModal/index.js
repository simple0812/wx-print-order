import React, { Component } from 'react';
import { View, Button, Image } from '@tarojs/components';
import { AtAvatar } from 'taro-ui';
import './index.less';

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { isOpened } = this.props;
        if(!isOpened) {
            return '';
        }
        return (
            <View className="loginModal">
                <View className="loginModal-mask" onClick={this.props.onClose}></View>
                <View className="loginModal-content">
                    <AtAvatar circle image={require('@/assets/user_default.png')} className="user-default" />
                    <View className="modal-title">住小咖设计师</View>
                    <View className="modal-desc">获取您的手机号信息</View>
                    <Button className="btn-phone" openType="getPhoneNumber" onGetPhoneNumber={this.props.onGetPhoneNumber}>
                        微信一键登录
                    </Button>

                    <Image onClick={this.props.onClose} className="close-icon" src={require('@/assets/close-icon.png')} />
                </View>
            </View>
        );
    }
}

export default LoginModal;
