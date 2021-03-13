import React, { Component } from 'react';
import { View } from '@tarojs/components';
import isEmpty from 'lodash/isEmpty'
import './index.less'

class WaterfallList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftHeight: 0,
            rightHeight: 0,
            leftList: [],
            rightList: [],
        };
    }

    componentDidUpdate(preProps) {

    }

    // 优化加载逻辑 每次只用加载计算新增数据的高度
    loadMore = dataSource => {
        const { getHeight } = this.props;
        let { leftHeight, rightHeight, leftList, rightList } = this.state;

        (dataSource || []).forEach(item => {
            let xHeight = getHeight(item) || 0;
            if (leftHeight <= rightHeight) {
                leftHeight += xHeight;
                leftList.push(item);
            } else {
                rightHeight += xHeight;
                rightList.push(item);
            }
        });

        this.setState({
            leftHeight,
            rightHeight,
            leftList,
            rightList,
        });
    };

    reset = dataSource => {
        this.setState(
            {
                leftHeight: 0,
                rightHeight: 0,
                leftList: [],
                rightList: [],
            },
            () => {
                this.loadMore(dataSource);
            },
        );
    };
    render() {
        const { leftList, rightList } = this.state;
        const { renderItem } = this.props;

        return (
            <View className="waterfallList">
                <View className="waterfallList__left">
                    {leftList.map(each => {
                        return renderItem(each);
                    })}
                </View>
                <View className="waterfallList__right">
                    {rightList.map(each => {
                        return renderItem(each);
                    })}
                </View>
            </View>
        );
    }
}

export default WaterfallList;
