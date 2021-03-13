import React, { Component } from "react";
import { Video, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtIcon } from "taro-ui";

class BnqVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { id } = this.props;
    if (id) {
      this.videoContext = Taro.createVideoContext(id);
    }
  }

  handlePlay = () => {
    if (this.videoContext && !this.state.isFull) {
      this.setState(
        {
          isFull: true,
        },
        () => {
          this.videoContext.requestFullScreen();
          this.videoContext.play();
        }
      );
    }
  };

  handleFullChange = (evt) => {
    console.log("handleFullChange", evt);
    evt.preventDefault();
    evt.stopPropagation();
    if (!evt.detail.fullScreen && this.videoContext) {
      this.videoContext.stop();
      this.videoContext.seek(0);
      this.setState({
        isFull: false,
      });
    }
  };
  render() {
    const {
      id,
      onFullscreenChange,
      controls,
      previewImage,
      ...restProps
    } = this.props;
    const { isFull } = this.state;

    return (
      <Video
        controls={!!isFull}
        id={id}
        showCenterPlayBtn
        onClick={this.handlePlay}
        showPlayBtn={!!isFull}
        showFullscreenBtn={!!isFull}
        poster={previewImage}
        showMuteBtn={!!isFull}
        onFullscreenChange={this.handleFullChange}
        objectFit='cover'
        pageGesture={false}
        {...restProps}
      />
    );
  }
}

export default BnqVideo;
