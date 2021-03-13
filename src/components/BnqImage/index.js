import React, { Component } from "react";
import { View, Image } from "@tarojs/components";
import "./index.scss";

class BnqImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // shouldComponentUpdate() {
  //   if (this.state.loaded) {
  //     return false;
  //   }

  //   return true;
  // }

  handleLoad = (res) => {
    this.setState({
      loaded: true,
    });
  };

 
  render() {
    const { src, className, onLoad, containerStyle, ...restProps } = this.props;
    const { loaded } = this.state;
    if (!src) {
      return "";
    }
    

    return (
      <View className={`bnqImage ${className || ""}`} style={{...containerStyle, background: '#ccc'}}>
        <Image
          src={src}
          className={`bnqImage-himage ${loaded ? 'loaded' : ''}`}
          {...restProps}
          onLoad={this.handleLoad}
        />
      </View>
    );
  }
}

export default BnqImage;
