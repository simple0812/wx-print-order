import Taro from '@tarojs/taro';

export const getRemoteImage = (url) => {
  return new Promise((resolve, reject) => {
    Taro.downloadFile({
      url, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject('下载失败')
        }
      },
      fail: () => {
        reject('下载失败')
      }
    })
  })
}


export const uploadImage = (filePath, qiniuToken,type) => {
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: 'https://up.qiniup.com',
      filePath,
      name: 'file',
      formData: {
        'token': qiniuToken,
      },
      success(res) {
        if (res.statusCode === 200) {
          const vData = JSON.parse(res.data);
          if(type == 0){
            return resolve(`https://res1.bnq.com.cn/${vData.key}?t=${new Date().getTime()}&width=${vData.w}&height=${vData.h}`)
          }else{
            return resolve(`https://res1.bnq.com.cn/${vData.key}?t=${new Date().getTime()}`)
          }
        } else {
          reject(new Error(res.errMsg))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}