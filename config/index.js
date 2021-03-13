var path = require('path');
var getIPAdress = require('./getIPAdress');

const config = {
  projectName: 'fcWeb',
  date: '2020-11-2',
  designWidth: 375,
  env: {
    LOCAL_IP: JSON.stringify(getIPAdress()),
    HOST_ENV: JSON.stringify(process.env.HOST_ENV || process.env.NODE_ENV)
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 1 / 2,
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: [],
  defineConstants: {
    LOCATION_APIKEY: JSON.stringify('3WFBZ-SYDE4-LZTUF-X56F7-TCNCQ-SZBZR')
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/service': path.resolve(__dirname, '..', 'src/service'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/store': path.resolve(__dirname, '..', 'src/store'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
  },
  framework: 'react',
  mini: {
    postcss: {
      "postcss-px-scale": {
        "enable": true,
        "config": {
          "scale": 0.5, // 缩放为 1/2
          "units": "rpx",
          "includes": ["taro-ui"]
        }
      },
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true
    }
    // webpackChain (chain, webpack) {
    //   chain.merge({
    //     module: {
    //       rule: {
    //         myloader: {
    //           // test: /\.md$/,
    //           use: [{
    //             loader: 'image-webpack-loader',
    //             options: {}
    //           }]
    //         }
    //       }
    //     }
    //   })
    // }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    router: {
      mode: 'browser', //'hash', // 
    },
    postcss: {
      "postcss-px-scale": {
        "enable": true,
        "config": {
          "scale": 0.5, // 缩放为 1/2
          "units": "rem",
          "includes": ["taro-ui"]
        }
      },
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    esnextModules: ['taro-ui'],
    devServer:{
      host: getIPAdress(),
      port: 9000,
      proxy: {
        '/appApi/*': {
          target: "https://fc-test.bthome.com",
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
