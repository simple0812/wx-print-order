import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.less';

class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { isOpen } = this.props;
        if (!isOpen) {
            return "";
        }
        return (
            <View className="bnq-dialog">
                <View className="bnq-dialog-mask" onClick={this.props.onClose}></View>
                <View className="bnq-dialog-body">{this.props.children}</View>
            </View>
        );
    }
}

export default Dialog;
