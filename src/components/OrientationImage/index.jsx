import React, { Component } from 'react';
import { Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import request from '@/utils/request';


class OrientationImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: props.src
    }
  }

  componentDidMount() {
    this.rotateImage();
  }

  rotateImage = async () => {
    let { src } = this.props;
    if (!src) {
      return;
    }

    let newSrc = src.split("?")[0];

    let res = await Taro.request({
      url: `${newSrc}?exif`,
    }).catch(() => null);

    let type = res?.Orientation?.val;
    /**
      1	上	左	0°
      2	上	右	水平翻转
      3	下	右	180°
      4	下	左	垂直翻转
      5	左	上	顺时针90°+水平翻转
      6	右	上	顺时针90°
      7	右	下	顺时针90°+垂直翻转
      8	左	下	逆时针90°
     */
    let typeMap = {
      'Bottom-right': 180,
      'Right-top': 90,
      'Left-bottom': 270
    }

    if (typeMap[type]) {
      newSrc = `${newSrc}?imageMogr2/strip/rotate/${typeMap[type]}`

      this.setState({
        src: newSrc
      })
    }
  }

  render() {
    const { src, ...restProps } = this.props;
    return (
      <Image src={this.state.src} {...restProps}></Image>
    );
  }
}

export default OrientationImage;