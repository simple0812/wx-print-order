var _ = require('lodash');

module.exports = class MockApi {
  constructor() {
    this.data = {};
  }

  covertData(method, api, mockData) {
    let temp = mockData;

    if (_.isBoolean(mockData)) {
      temp = {
        code: mockData ? 200 : 500,
        success: mockData,
        message: mockData ? 'success' : 'bad request'
      };
    }
    this.data[`${api}|_${method.toUpperCase()}`] = {
      method,
      url: api,
      mockData: {
        success: true,
        code: 200,
        message: '',
        ...temp
      }
    };
  }

  get(api, mockData) {
    this.covertData('get', api, mockData);
    return this;
  }

  put(api, mockData) {
    this.covertData('put', api, mockData);
    return this;
  }

  post(api, mockData) {
    this.covertData('post', api, mockData);
    return this;
  }

  delete(api, mockData) {
    this.covertData('delete', api, mockData);
    return this;
  }
};
