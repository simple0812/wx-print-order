var nodemon = require('nodemon');
var fs = require('fs');
var path = require('path');

nodemon({
  script: path.resolve(__dirname, './mockServer.js'),
  watch: [
    path.resolve(__dirname, './')
  ],
  ext: 'js json'
});

nodemon.on('restart', function (files) {
  console.log('App restarted due to: ', files);

  // 修改index.js 触发页面刷新
  let indexPath = path.resolve(global.rootDir, 'src/index.js');
  try {
    let res = fs.readFileSync(indexPath, 'utf-8');
    let lines = res.split('\n');

    if (lines[0].match(/\/\/\s*modify at/)) {
      lines[0] = `// modify at ${Date.now()}, 用于触发网页重载`;
    } else {
      lines.unshift(`// modify at ${Date.now()}, 用于触发网页重载`);
    }
    fs.writeFileSync(indexPath, lines.join('\n'), 'utf-8');
  } catch (e) {}
});