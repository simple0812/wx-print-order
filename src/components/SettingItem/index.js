import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import cn from 'classnames';
import './index.less';

class SettingItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { arrow, title, extraText, bottomGap, noBorder, onItemClick } = this.props;
        return (
            <View
                onClick={onItemClick}
                className={cn('settings-item', {
                    noborder: !!noBorder,
                    bottomgap: !!bottomGap,
                })}
            >
                <View className="settings-item__left">{title}</View>
                <View className="settings-item__right">
                    {  extraText || ''}
                    {arrow && <Image src={require('@/assets/right.png')} mode="widthFix" className="settings-arrow" />}
                </View>
            </View>
        );
    }
}

export default SettingItem;
