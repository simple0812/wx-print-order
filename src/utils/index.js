/* eslint-disable import/no-commonjs */
import Taro from '@tarojs/taro';

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms || 100);
  });
}

export function formatUserName(name) {
  if (!name || name.length === 1) {
    return name;
  }

  if (name.length === 2) {
    return name[0] + "*";
  }
  let p = name.split("");
  let tArr = new Array(p.length - 2);
  p.splice(1, name.length - 2, [tArr.fill("*").join("")]);
  return p.join("");
}

//使用七牛生成缩略图
export function thumbnailImage(src, opt) {
  if (!src) {
    return;
  }

  let xSrc = src.split("?")[0];

  return `${xSrc}?imageView2/1${opt?.width ? "/w/" + opt.width : ""}${
    opt?.height ? "/h/" + opt.height : ""
  }${opt?.quality ? "/q/" + opt.quality : ""}`;
}

// 使用七牛的无损压缩方案 收费
export function compressImage(src) {
  if (!src) {
    return;
  }

  if (src.indexOf("?") > 0) {
    return src + "&imageslim";
  }

  return `${src}?imageslim`;
}

export function getScaleSize(size, tWidth) {
  if (!size.width || !size.height || !tWidth) {
    return size
  }

  let sysInfo = Taro.getSystemInfoSync();
  let sWidth = sysInfo.windowWidth;
  if (sWidth > 640) {
    sWidth = 640;
  }

  // 按照设计宽度缩放
  let realWidth = tWidth * sWidth / 375;

  return {
    width: realWidth,
    height: realWidth * size.height / size.width
  }

}