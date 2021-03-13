import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import cn from 'classnames';
import { AtIcon } from 'taro-ui';
import './index.scss';

class DownloadApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHidden: false,
        };
    }

    handleDownload = () => {
        const params = {
            apiVersion: '1',
            appKey: 'ljQMKsw9ffAwhsqx',
            appName: 'new_bnq_h5',
            appVersion: '1.0.0',
            env: 'production',
            pageState: 'f',
            platform: 'h5',
            type: 'event',
            eventId: '001002',
        };

        params.timestamp = ~~(Date.now() / 1000);
        params.lastFocusTime = ~~(Date.now() / 1000);
        /**
         * 131 工长详情
         * 132 工地详情
         * 133 设计师详情
         * 134 案例详情
         * 135 装企详情
         */
        params.currentPage = this.props.currentPage;

       

        if (Taro.getEnv() === 'WEB') {
            Taro.request({
                url: 'https://beluga.bnq.com.cn/api/v1/collect/insert',
                method: 'post',
                data: params,
                success() {
                    console.log('下载埋点成功')
                },
                complete() {
                    window.location.href = 'https://zt.web.bnq.com.cn/project/app_down.html';
                }
            })
           
        }
    };
    render() {
        const { isHidden } = this.state;
        return (
            <View className={cn('download-app', { hidden: isHidden })}>
                <View className="download-app__left">
                    <Image src={require('./assets/logo.jpg')} className="download-logo" />
                    <Text className="download-desc">专注品质装修</Text>
                </View>

                <View className="btn-download" onClick={this.handleDownload}>
                    点击下载
                </View>
            </View>
        );
    }
}

export default DownloadApp;
