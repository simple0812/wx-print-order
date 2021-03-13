import React, { Component } from "react";
import { View, Button, Text, Image, Video, Canvas, ScrollView } from '@tarojs/components'
import { AtAvatar, AtActionSheet, AtActionSheetItem, AtButton } from 'taro-ui';
import Taro from "@tarojs/taro";
import { createShowreelImg, createDesignerImg } from '@/utils/canvasHelper';


import haibaoPng from "@/assets/build/icon-post.png";
import pengyouPng from "@/assets/build/icon-circle.png";
import './index.less'

class Poster extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    Taro.eventCenter.on("refresh_site", () => {
      this.setState({
        posterImage: null
      })
    });
  }

  componentWillUnmount() {
    Taro.eventCenter.off("refresh_site");
  }

  generatePoster = async () => {
    const { posterImage } = this.state;
    const { createPosterFn } = this.props;
    if (!createPosterFn) {
      Taro.showToast({
        icon: 'none',
        title: '生成图片的函数不能为空'
      })
      return;
    }
    if (this.props.onCloseSheet) {
      this.props.onCloseSheet();
    }
    if (posterImage) {
      // Taro.previewImage({
      //   urls: [posterImage],
      //   success() {
      //     console.log("preview");
      //   }
      // });
      this.setState({
        isPreview: true
      })
      
      return;
    }
    Taro.showLoading({
      mask: true
    });

    const { posterInfo } = this.props;

    try {

      let xposterImage = await createPosterFn("mycanvas", { ...posterInfo });
      console.log('xposterImage', xposterImage)
      if (xposterImage) {
        this.setState({
          isPreview: true,
          posterImage: xposterImage 
        });
        
      }
    } finally {
      Taro.hideLoading();
    }
  };

  handlePreview = (evt) => {
    const { posterImage } = this.state;
    evt.preventDefault();
    evt.stopPropagation();
    if (posterImage) {
      Taro.previewImage({
        urls: [posterImage],
        success() {
          console.log("preview");
        }
      });
      return;
    }
  }

  closePreview = () => {
    this.setState({
      isPreview: false
    })
  }

  handleSave = (evt) => {

    let _this = this;
    const { onSuccess } = this.props;
    onSuccess && onSuccess()

    evt.preventDefault();
    evt.stopPropagation();
    Taro.saveImageToPhotosAlbum({
      filePath: this.state.posterImage,
      success: function (res) {
        Taro.showToast({
          icon: 'none',
          title: '已保存至相册,可以发朋友圈啦~'
        })

        _this.setState({
          isPreview: false
        })
      }
    })
  }

  render() {
    const { posterImage } = this.state;
    const { canvasStyle, posterProps } = this.props;
    return (
      <View className='posterCom' >
        <AtActionSheet
          isOpened={this.props.isOpened}
          title="分享"
          className="share-sheet"
          onClose={this.props.onCloseSheet}
        >
          <AtActionSheetItem className="shareModal-box">
            <AtButton className="haibao" onClick={this.generatePoster}>
              <Image src={haibaoPng} className="btn-icon" />
              <View className="btn-text">生成分享海报</View>
            </AtButton>
          </AtActionSheetItem>
          <AtActionSheetItem className="shareModal-box">
            <AtButton
              className="pengyou"
              openType="share"
              onClick={this.props.onCloseSheet}
            >
              <Image src={pengyouPng} className="btn-icon" />
              <View className="btn-text">转发给好友</View>
            </AtButton>
          </AtActionSheetItem>
        </AtActionSheet>
        <View className="canvas-container">
          <Canvas canvasId="mycanvas" style={{ width: 310, height: 484, ...canvasStyle }} />
        </View>
        {this.state.isPreview && (
          <View className="poster-preview" onClick={this.closePreview}>
            <Image
              mode="heightFix"
              className="poster-preview-image"
              src={posterImage}
              onClick={this.handlePreview}
              {...posterProps}
            />
            <Button className="poster-preview-button" onClick={this.handleSave}>
              分享至朋友圈
            </Button>
          </View>
        )}
      </View>
    );
  }
}

export default Poster;
