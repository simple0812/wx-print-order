import React, { Component } from 'react'
import { View } from '@tarojs/components'
import './index.scss'

export default class Loading extends Component {
    state = {
        current: 0
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                current: (this.state.current + 1) % 3
            })
        }, 500)
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    render() {
        const { current } = this.state;
        return (
            <View className='abc-x-loading'>
                <View className={current == 0 ? 'dot-x active' : 'dot-x'}>.</View>
                <View className={current == 1 ? 'dot-x active' : 'dot-x'}>.</View>
                <View className={current == 2 ? 'dot-x active' : 'dot-x'}>.</View>
            </View>
        )
    }
}