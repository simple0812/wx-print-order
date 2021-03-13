var express = require('express');
var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');
var Mock = require('mockjs');
var mockConfig = require('./mockConfig');

var app = express();

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  // res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
});


function start() {

  let xMock = {
    ...mockConfig
  };

  _.keys(xMock).forEach((key) => {
    let temp = xMock[key];
    console.log(temp.method.toLocaleLowerCase(), temp.url);
    app[temp.method.toLocaleLowerCase()](temp.url, function (req, res) {
      res.json(Mock.mock(_.cloneDeep(temp.mockData)));
    });
  });

  app.listen(9000, () => {
    console.log('mock服务开启');
  });
}

start();
