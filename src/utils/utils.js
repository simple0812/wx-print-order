import Taro from "@tarojs/taro";

export function throttle(func, wait) {
  let previous = Date.now();
  return function () {
    const now = Date.now();
    const context = this;
    const args = [...arguments];
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}

export function catchPromise(fn) {
  return new Promise((resolve, reject) => {
    fn.then(
      (res) => resolve(res),
      (err) => {
        console.error(err);
        reject();
      }
    ).catch((e) => {
      console.error(e);
      resolve(e);
    });
  });
}

export const getDesignerQualification = (code) => {
  switch (code) {
    case "DT10001":
      return require("../assets/designer/designer_qualification_DT10001.png");
    case "DT10002":
      return require("../assets/designer/designer_qualification_DT10002.png");
    case "DT10003":
      return require("../assets/designer/designer_qualification_DT10003.png");
    case "DT10004":
      return require("../assets/designer/designer_qualification_DT10004.png");
    case "DT10005":
      return require("../assets/designer/designer_qualification_DT10005.png");
    case "DT10006":
      return require("../assets/designer/designer_qualification_DT10006.png");
    case "DT10007":
      return require("../assets/designer/designer_qualification_DT10007.png");
    case "DT20001":
      return require("../assets/designer/designer_qualification_DT10008.png");
    default:
      return "";
  }
};

export function Deconstruction(res) {
  // if (res && res.data && res.data.message === "登录异常！") {
  //   Taro.showModal({
  //     content: "登录异常，请重新登录",
  //     showCancel: false,
  //     success: function (response) {
  //       if (response.confirm) {
  //         console.log("用户点击确定");
  //         dispatch.user.asyncLoginOut();
  //       }
  //     },
  //   });
  //   return;
  // }
  if (
    !res ||
    (res && res.errMsg === "request:fail ") ||
    (res && res.statusCode && res.statusCode !== 200) ||
    (res && res.code && res.code !== 200)
  ) {
    Taro.showToast({
      title:
        res && res.statusCode
          ? "网络异常：" + res.statusCode
          : res && res.code
          ? "网络异常：" + res.code
          : "网络异常",
      icon: "none",
      duration: 3000,
      success: () => {
        return new Promise((resolve, reject) => {
          reject();
        });
      },
    });
  } else {
    const { code, success = false, message = "", detail = "", data = {} } = res;
    if (code === 0 && success) {
      return data;
    } else {
      let msg = message || detail;
      if (msg) {
        Taro.showToast({
          title: msg.length > 60 ? msg.substring(0, 60) + "..." : msg,
          icon: "none",
          duration: 3000,
          success: () => {
            return new Promise((resolve, reject) => {
              reject();
            });
          },
        });
      }
    }
  }
}

export function getSystemInfo() {
  if (Taro.globalSystemInfo && !Taro.globalSystemInfo.ios) {
    return Taro.globalSystemInfo;
  } else {
    // h5环境下忽略navbar
    // if (!isFunction(Taro.getSystemInfoSync)) {
    //   return null;
    // }
    let systemInfo = Taro.getSystemInfoSync() || {
      model: "",
      system: "",
    };
    let ios = !!((systemInfo.system||'').toLowerCase().search("ios") + 1);
    let rect;
    try {
      rect = Taro.getMenuButtonBoundingClientRect
        ? Taro.getMenuButtonBoundingClientRect()
        : null;
      if (rect === null) {
        throw "getMenuButtonBoundingClientRect error";
      }
      //取值为0的情况  有可能width不为0 top为0的情况
      if (!rect.width || !rect.top || !rect.left || !rect.height) {
        throw "getMenuButtonBoundingClientRect error";
      }
    } catch (error) {
      let gap; //胶囊按钮上下间距 使导航内容居中
      let width = 96; //胶囊的宽度
      if (systemInfo.platform === "android") {
        gap = 8;
        width = 96;
      } else if (systemInfo.platform === "devtools") {
        if (ios) {
          gap = 5.5; //开发工具中ios手机
        } else {
          gap = 7.5; //开发工具中android和其他手机
        }
      } else {
        gap = 4;
        width = 88;
      }
      if (!systemInfo.statusBarHeight) {
        //开启wifi的情况下修复statusBarHeight值获取不到
        systemInfo.statusBarHeight =
          systemInfo.screenHeight - systemInfo.windowHeight - 20;
      }
      rect = {
        //获取不到胶囊信息就自定义重置一个
        bottom: systemInfo.statusBarHeight + gap + 32,
        height: 32,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        top: systemInfo.statusBarHeight + gap,
        width: width,
      };
      console.log("error", error);
      console.log("rect", rect);
    }

    let navBarHeight = "";
    if (!systemInfo.statusBarHeight) {
      //开启wifi和打电话下
      systemInfo.statusBarHeight =
        systemInfo.screenHeight - systemInfo.windowHeight - 20;
      navBarHeight = (function () {
        let gap = rect.top - systemInfo.statusBarHeight;
        return 2 * gap + rect.height;
      })();

      systemInfo.statusBarHeight = 0;
      systemInfo.navBarExtendHeight = 0; //下方扩展4像素高度 防止下方边距太小
    } else {
      navBarHeight = (function () {
        let gap = rect.top - systemInfo.statusBarHeight;
        return systemInfo.statusBarHeight + 2 * gap + rect.height;
      })();
      if (ios) {
        systemInfo.navBarExtendHeight = 4; //下方扩展4像素高度 防止下方边距太小
      } else {
        systemInfo.navBarExtendHeight = 0;
      }
    }

    systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight
    systemInfo.capsulePosition = rect; //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
    systemInfo.ios = ios; //是否ios
    Taro.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了
    //console.log('systemInfo', systemInfo);
    return systemInfo;
  }
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
