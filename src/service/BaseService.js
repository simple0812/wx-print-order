import request from '../utils/request.js';

const { get, post } = request;
export function getFn(url, urlType) {
  return function (...params) {
    return get(url, ...params, urlType);
  };
}

export function postFn(url, urlType) {
  return function (...params) {
    return post(url, ...params, urlType);
  };
}

export default class BaseService {
  constructor(moduleName = '', apiMap = {}) {
    this.moduleName = moduleName;
    /**
     * url: fn || string  请求地址
     * method: string  请求方法
     * formatParams: fn  参数调整
     */
    let baseApi = {};

    // 如果moduleName为空 则不写入默认的接口
    if (moduleName) {
      baseApi = {
        getList: `${moduleName}/GetPage.json`,
        getDetail: `${moduleName}/GetDetail.json`,
        create: postFn(`${moduleName}/Add.json`),
        update: postFn(`${moduleName}/Update.json`),
        multiRemove: postFn(`${moduleName}/Delete.json`),
        remove: postFn(`${moduleName}/Delete.json`)
      };
    }

    this.apiMap = {
      ...baseApi,
      ...apiMap
    };

    this.methodMap = {
      get: get,
      post: post
    };

    this.init();
  }

  init = () => {
    Object.keys(this.apiMap).forEach((key) => {
      if (!this[key]) {
        if (Object.prototype.toString.call(this.apiMap[key]) === "[object Function]") {
          this[key] = this.apiMap[key];
        } else {
          this[key] = (params) => {
            return this.handleRequest(key, params);
          };
        }
      }
    });
  };

  getApi(type = '', params) {
    let xApi = this.apiMap[type] || '';
    if (Object.prototype.toString.call(xApi) === "[object String]") {
      return {
        url: xApi
      };
    }

    if (Object.prototype.toString.call(xApi) === "[object Function]") {
      return {
        method: xApi.method || 'get',
        url: xApi.url(params),
        formatParams: xApi.formatParams || ''
      };
    }

    return xApi;
  }

  handleRequest = (type, params) => {
    let xApi = this.getApi(type, params) || {};
    let reqMethod = get;

    if (xApi.method) {
      reqMethod = this.methodMap[xApi.method.toLocaleLowerCase()] || get;
    }

    let xParams = { ...params };
    if (Object.prototype.toString.call(xApi.formatParams) === "[object Function]") {
      xParams = xApi.formatParams({ ...params });
    }
    return reqMethod(xApi.url || '', xParams);
  };
}
