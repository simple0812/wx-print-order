import Taro from "@tarojs/taro";

/**该方法用来绘制一个有填充色的圆角矩形
 *@param cxt:canvas的上下文环境
 *@param x:左上角x轴坐标
 *@param y:左上角y轴坐标
 *@param width:矩形的宽度
 *@param height:矩形的高度
 *@param radius:圆的半径
 *@param fillColor:填充颜色
 **/
export function fillRoundRect(
  cxt,
  x,
  y,
  width,
  height,
  radius,
  /*optional*/ fillColor
) {
  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false;
  }

  cxt.save();
  cxt.translate(x, y);
  //绘制圆角矩形的各个边
  drawRoundRectPath(cxt, width, height, radius);
  cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值
  cxt.fill();
  cxt.restore();
}

/**该方法用来绘制圆角矩形
 *@param cxt:canvas的上下文环境
 *@param x:左上角x轴坐标
 *@param y:左上角y轴坐标
 *@param width:矩形的宽度
 *@param height:矩形的高度
 *@param radius:圆的半径
 *@param lineWidth:线条粗细
 *@param strokeColor:线条颜色
 **/
export function strokeRoundRect(
  cxt,
  x,
  y,
  width,
  height,
  radius,
  /*optional*/ lineWidth,
  /*optional*/ strokeColor
) {
  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false;
  }

  cxt.save();
  cxt.translate(x, y);
  //绘制圆角矩形的各个边
  drawRoundRectPath(cxt, width, height, radius);
  cxt.lineWidth = lineWidth || 2; //若是给定了值就用给定的值否则给予默认值2
  cxt.strokeStyle = strokeColor || "#000";
  cxt.stroke();

  cxt.restore();
}

export function drawRoundRectPath(cxt, width, height, radius) {
  cxt.beginPath(0);
  //从右下角顺时针绘制，弧度从0到1/2PI
  cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

  //矩形下边线
  cxt.lineTo(radius, height);

  //左下角圆弧，弧度从1/2PI到PI
  cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

  //矩形左边线
  cxt.lineTo(0, radius);

  //左上角圆弧，弧度从PI到3/2PI
  cxt.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);

  //上边线
  cxt.lineTo(width - radius, 0);

  //右上角圆弧
  cxt.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);

  //右边线
  cxt.lineTo(width, height - radius);
  cxt.closePath();
}

const getRemoteImage = (url) => {
  return new Promise((resolve, reject) => {
    Taro.downloadFile({
      url, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        } else {
          reject("下载失败");
        }
      },
      fail: () => {
        reject("下载失败");
      },
    });
  });
};

export const createDesignerImgx = async (canvasId, designerInfo) => {
  let ctx = Taro.createCanvasContext(canvasId);
  Taro.downloadFile({
    url:
      "http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg",
    success: async function (res) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(50, 50, 25, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(res.tempFilePath, 25, 25);
      ctx.restore();
      ctx.draw();

      await delay(250);
      try {
        let tempFilePath = await saveImagePromise(canvasId);
        Taro.previewImage({
          urls: [tempFilePath],
          success() {
            console.log("preview");
          },
        });

        return tempFilePath;
      } catch (e) {}
    },
  });
};

export const createDesignerImg = async (canvasId, designerInfo) => {
  let context = Taro.createCanvasContext(canvasId);

  console.log("designerInfo", designerInfo);

  context.save();
  context.setFillStyle("#000");
  context.fillRect(0, 0, 310, 484);
  context.restore();

  context.save();
  drawRoundRectPath(context, 310, 484, 16);
  context.clip();

  context.setFillStyle("#fff");
  context.fill();
  context.restore();

  let lines = getMultiLines(
    context,
    `${designerInfo.provinceName}${designerInfo.cityName} · 作品 ${
      designerInfo.designStyleNum || 0
    }`,
    { maxWidth: 155, fontSize: 11 }
  );
  let isMultiple = lines?.length > 1;

  //绘制名字
  context.save();
  context.font = "18px PingFangSC-Medium";
  context.setTextAlign("left");
  // context.fillText(`${designerInfo.componyName}`, 84, 40);
  writeText(
    context,
    `${designerInfo.componyName}`,
    {
      x: 84,
      y: isMultiple ? 30 : 40,
      lineHeight: 20,
      maxWidth: 214,
      maxLines: 1,
    },
    { fontStyle: "#333", fontSize: 18 }
  );

  context.stroke();
  context.restore();

  //绘制地址和作品数
  context.save();
  context.font = "11px PingFangSC";
  context.setFillStyle("#666");
  context.setTextAlign("left");
  writeText(
    context,
    `${designerInfo.provinceName}${designerInfo.cityName} · 作品 ${
      designerInfo.designStyleNum || 0
    }`,
    {
      x: 84,
      y: isMultiple ? 50 : 60,
      lineHeight: 15,
      maxWidth: 214,
      maxLines: 2,
    },
    { fontStyle: "#666", fontSize: 11 }
  );
  // context.fillText(
  //   `${designerInfo.provinceName}${designerInfo.cityName} · 作品 ${
  //     designerInfo.designStyleNum || 0
  //   }`,
  //   84,
  //   60
  // );
  context.stroke();
  context.restore();

  // 绘制价格
  let ret = [];
  if (designerInfo.minDesignFee || designerInfo.minDesignFee === 0) {
    ret.push(designerInfo.minDesignFee);
  }

  if (designerInfo.maxDesignFee) {
    ret.push(designerInfo.maxDesignFee);
  }
  if (ret && ret.length > 0) {
    context.save();
    context.font = "11px PingFangSC";
    context.setFillStyle("#666");
    context.setTextAlign("left");
    context.fillText(`${ret.join("-")}元/平米`, 84, isMultiple ? 85 : 80);
    context.stroke();
    context.restore();
  }

  // //绘制头像

  if (designerInfo.headImg) {
    let userIcon = await getRemoteImage(designerInfo.headImg);
    if (userIcon) {
      context.save();
      context.beginPath();
      context.arc(45, 50, 25, 0, 2 * Math.PI); //画出圆
      context.clip(); //裁剪上面的圆形

      context.drawImage(userIcon, 20, 25, 50, 50);

      context.restore();
      // context.draw();
    }
  }

  // 渲染内容区域的大图片
  context.save();
  context.translate(16, 100);
  //绘制圆角矩形的各个边
  drawRoundRectPath(context, 279, 279, 8);
  context.clip();
  let contentImageUrl = designerInfo.homepageImg;
  if (contentImageUrl) {
    let contentImage = await getRemoteImage(
      contentImageUrl + `?imageView2/1/w/1200`
    ).catch(() => {});

    if (contentImage) {
      context.drawImage(contentImage, 0, 0, 279, 279);
    }
  }

  context.restore();

  // 渲染内容区域的二维码
  context.save();
  let qrCodeUrl = designerInfo.qrcodePath;
  if (qrCodeUrl) {
    let qrImage = await getRemoteImage(qrCodeUrl).catch(() => {});
    if (qrImage) {
      context.drawImage(qrImage, 16, 390, 80, 80);
    }
  }
  context.restore();

  // // 渲染内容区域的长按文案
  context.save();
  context.beginPath();
  context.font = "14px PingFangSC";
  context.setFillStyle("#345C7D");
  context.setTextAlign("left");
  context.fillText(`长按查看详情`, 100, 425);
  context.stroke();
  context.closePath();
  context.restore();

  // // 渲染内容区域的来自文案
  context.save();
  context.beginPath();
  context.font = "12px PingFangSC";
  context.setFillStyle("#999");
  context.setTextAlign("left");
  context.fillText(`来自住小咖`, 100, 442);
  context.stroke();
  context.closePath();
  context.restore();

  context.draw();

  //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
  await delay(250);
  try {
    let tempFilePath = await saveImagePromise(canvasId);
    // Taro.previewImage({
    //   urls: [tempFilePath],
    //   success() {
    //     console.log("preview");
    //   },
    // });

    return tempFilePath;
  } catch (e) {}
};

export const createShowreelImg = async (
  canvasId,
  { designerInfo, productDetailInfo }
) => {
  let context = Taro.createCanvasContext(canvasId);
  console.log("createShowreelImg", designerInfo, productDetailInfo);

  context.save();
  context.setFillStyle("#000");
  context.fillRect(0, 0, 310, 484);
  context.restore();

  context.save();
  drawRoundRectPath(context, 310, 484, 16);
  context.clip();

  context.setFillStyle("#fff");
  context.fill();
  context.restore();
  //绘制title
  let rows = writeText(
    context,
    `${productDetailInfo?.caseInfoVO?.caseTitle || ""}`,
    { x: 16, y: 40, lineHeight: 26, maxWidth: 280 },
    {}
  );

  // 绘制 作品信息
  context.save();
  context.font = "12px PingFangSC";
  context.setFillStyle("#999");
  context.setTextAlign("left");
  let ret = [];
  let caseInfoVO = productDetailInfo?.caseInfoVO || {};
  if (caseInfoVO.caseHouseTypeName) {
    ret.push(caseInfoVO.caseHouseTypeName);
  }
  if (caseInfoVO.caseSize) {
    ret.push(caseInfoVO.caseSize + "平米");
  }
  if (caseInfoVO.totalCost) {
    ret.push(caseInfoVO.totalCost + "万元");
  }

  if (caseInfoVO?.caseCostType === 1) {
    ret.push(caseInfoVO.totalCost + "万元");
  } else if (caseInfoVO?.caseCostType === 2) {
    let xCost =
      (caseInfoVO?.designCost ?? 0) +
      (caseInfoVO?.hardCost ?? 0) +
      (caseInfoVO?.softCost ?? 0);
    ret.push(xCost + "万元");
  }

  let designStyleNameArr = [];
  !!caseInfoVO?.designStyleList &&
    caseInfoVO?.designStyleList.map(
      (value, index) => (designStyleNameArr[index] = value?.name)
    );

  if (designStyleNameArr.length) {
    ret.push(designStyleNameArr.join(" "));
  }
  context.fillText(ret.join(" · "), 16, rows > 1 ? 90 : 70);
  context.restore();

  // 渲染内容区域的大图片
  context.save();
  context.translate(16, 100);
  //绘制圆角矩形的各个边
  drawRoundRectPath(context, 279, 279, 8);
  context.clip();
  let contentImageUrl = productDetailInfo.coverImg;
  if (contentImageUrl) {
    let contentImage = await getRemoteImage(
      contentImageUrl + `?imageView2/1/w/1200`
    ).catch(() => {});

    if (contentImage) {
      context.drawImage(contentImage, 0, 0, 279, 279);
    }
  }

  context.restore();

  // 绘制DESIGN BY
  context.save();
  context.font = "18px PingFangSC";
  context.setFillStyle("#ccc");
  context.setTextAlign("left");
  context.fillText(`DESIGN BY`, 16, 405);
  context.restore();

  // 绘制设计师头像
  context.save();
  context.beginPath();
  context.arc(36, 440, 20, 0, 2 * Math.PI); //画出圆
  context.clip(); //裁剪上面的圆形

  context.setFillStyle("#fff");
  context.fill(); //裁剪上面的圆形
  context.strokeStyle = "white";
  context.stroke();
  context.closePath();
  if (designerInfo?.headImg) {
    let userIcon = await getRemoteImage(designerInfo.headImg);
    if (userIcon) {
      context.drawImage(userIcon, 16, 420, 40, 40);
    }
  }
  context.restore();

  // 绘制设计师名称
  if (designerInfo?.componyName) {
    context.save();
    context.font = "14px PingFangSC";
    // context.setFillStyle("#333");
    // context.setTextAlign("left");
    // context.fillText(designerInfo.componyName, 60, 445, 200);
    let lines = getMultiLines(context, designerInfo.componyName, {
      maxWidth: 125,
      fontSize: 14,
    });
    let y = 445;
    if (lines?.length > 1) {
      y = 445 - 10;
    }

    writeText(
      context,
      `${designerInfo.componyName}`,
      { x: 60, y, lineHeight: 20, maxWidth: 125, maxLines: 2 },
      { fontStyle: "#333", fontSize: 14 }
    );
    context.restore();
  }

  // 渲染内容区域的二维码
  if (caseInfoVO?.qrCode) {
    context.save();
    let qrCodeUrl = caseInfoVO?.qrCode;
    if (qrCodeUrl) {
      let qrImage = await getRemoteImage(qrCodeUrl).catch(() => {});
      if (qrImage) {
        context.drawImage(qrImage, 217, 390, 60, 60);
      }
    }
    context.restore();

    // 渲染内容区域的长按文案
    context.save();
    context.font = "14px PingFangSC";
    context.setFillStyle("#345C7D");
    context.setTextAlign("left");
    context.fillText(`长按查看详情`, 204, 465);
    context.restore();
  }

  //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
  context.draw();
  await delay(250);

  try {
    let tempFilePath = await saveImagePromise(canvasId);
    // Taro.previewImage({
    //   urls: [tempFilePath],
    //   success() {
    //     console.log("preview");
    //   },
    // });

    return tempFilePath;
  } catch (e) {}
};

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve("ok");
    }, ms || 100);
  });
};

const saveImagePromise = (canvasId) => {
  return new Promise((resolve, reject) => {
    Taro.canvasToTempFilePath({
      canvasId,
      success: function (res) {
        // setImagePath(tempFilePath)
        resolve(res.tempFilePath);
      },
      fail: function (res) {
        console.log("err", res);
        reject(res);
      },
    });
  });
};

function writeText(
  context,
  text,
  { x, y, lineHeight, maxWidth, maxLines = 2 },
  { fontSize, fontStyle }
) {
  context.save();
  context.beginPath();

  let systemInfo = Taro.getSystemInfoSync();
  maxWidth = maxWidth || systemInfo.windowWidth;
  // let gapWidth = (10 * systemInfo.windowWidth) / 375;
  let gapWidth = 0;

  var chr = text.split("");
  var temp = "";
  var row = [];
  context.setFontSize(fontSize || 18);
  context.setFillStyle(fontStyle || "#000");
  for (var a = 0; a < chr.length; a++) {
    if (context.measureText(temp).width < maxWidth - gapWidth) {
      temp += chr[a];
    } else {
      a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
      row.push(temp);
      temp = "";
    }
  }
  row.push(temp);

  console.log("rows", row);

  //如果数组长度大于2 则截取前两个
  if (row.length >= maxLines) {
    var rowCut = row.slice(0, maxLines);
    var rowPart = rowCut[maxLines - 1];
    var test = "";
    for (var a = 0; a < rowPart.length; a++) {
      if (context.measureText(test).width < maxWidth - gapWidth) {
        test += rowPart[a];
      } else {
        break;
      }
    }
    if (row.length > maxLines) {
      test += "..."; //最后一行 超出的用...表示
    }
    rowCut.splice(maxLines - 1, 1, test);
    row = rowCut;
  }
  for (var b = 0; b < row.length; b++) {
    context.fillText(row[b], x, y + b * lineHeight, maxWidth);
  }

  context.closePath();
  context.restore();

  return row.length;
}

// 使用canvas计算文本的宽度 从而计算文本的行数
export function getMultiLines(context, text, { maxWidth, fontSize }) {
  context.save();
  context.beginPath();
  let systemInfo = Taro.getSystemInfoSync();
  maxWidth = maxWidth || systemInfo.windowWidth;

  var chr = text.split("");
  var temp = "";
  var row = [];
  context.setFontSize(fontSize || 14);
  for (var a = 0; a < chr.length; a++) {
    if (
      context.measureText(temp).width <
      maxWidth - (10 * systemInfo.windowWidth) / 375
    ) {
      temp += chr[a];
    } else {
      a--;
      row.push(temp);
      temp = "";
    }
  }
  row.push(temp);
  return row;
}
