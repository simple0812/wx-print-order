/* eslint-disable no-unused-vars */
import Taro from '@tarojs/taro';
import { HTTP_STATUS } from './HttpStatus';
import Config from '../../config/config';

import { toJS } from 'mobx'

class Remote {
  static METHOD = {
    GET: 'GET',
    POST: 'POST',
  };

  constructor() {
    Taro.addInterceptor(this.interceptor);
    this.request = Taro.request;
  }

  // 拦截器
  interceptor = function (chain) {
    const requestParams = chain.requestParams;
    const { method, data, url } = requestParams;
    // console.log(`http ${method || 'GET'} --> ${url} data: `, data);
    // 发送请求之前处理
    return chain.proceed(requestParams)
      .then(res => {
        // console.log(`http <-- ${url} result:`, res);
        if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data;
        }

        throw new Error(res.errMsg || '未知错误')
      })
  }

  /**
   * 获取当前所处环境。
   * 通过配置node环境变量来获取
   * 暂定
   * 开发环境： development
   * 线上环境： production
   * @return string
   */
  getHostEnv = () => {
    return process.env.HOST_ENV || 'production';
  };

  /**
  *  依照环境生成域名
  *  @return string
  */
  genDomainForEnv = (type) => {
    const env = this.getHostEnv();
    const typeJson = {
      default: `${Config[env].apiUrl}${Config[env].apiUrlFilter}`,
      prize: `${Config[env].prizeUrl}${Config[env].prizeUrlFilter}`,
      auth: `${Config[env].authUrl}${Config[env].authUrlFilter}`,
      qiniu: `${Config[env].qiniuUrl}`,
      im: `${Config[env].imUrl}`,
      invoice: `${Config[env].targetInvoiceUrl}`,
      // map: `${Config[env].tenxunMapUrl}`,
    };
    return typeJson[type];
  };

  http = async ({ method, url, data, header = {} }) => {
    const options = {
      method,
      url,
      data,
      header,
    }

    // 获取token加入请求头
    const sessionToken = Taro.getStorageSync('sessionToken');
    if (sessionToken) {
      options.header.sessionToken = sessionToken;
      options.header.token = sessionToken;
    }

    try {
      const res = await this.request(options);
      return res;
    } catch (error) {
      console.log('http error ->', error);
    }
  }

  get = async (url, data, urlType) => {
    const options = {
      data,
      url: `${this.genDomainForEnv(urlType || 'default')}${url}`,
      method: Remote.METHOD.GET,
    }
    const res = await this.http(options)
    return res
  }

  post = async (url, data, urlType) => {
    const options = {
      data,
      url: `${this.genDomainForEnv(urlType || 'default')}${url}`,
      method: Remote.METHOD.POST,
      header: {
        'content-type': 'application/json',
      },
    }
    return this.http(options);
  }
}

const remote = new Remote();

export default remote;
