var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');   // 解決跨網域問題

// router
var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

// 補捉程式錯誤，抓戰犯用XD
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(err);
  process.exit(1);
});

var app = express();
require('./connections/index');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', postsRouter);
app.use('/api', usersRouter);

// 404 not found 
app.use((req, res, next) => {
  res.status(404).send({
    "status": 'error',
    "message": "無此網路路由"
  });
  res.end();
  next();
});

// express 錯誤處理
app.use((err, req, res, next) => {
  res.status(500).send({
    "error": err.message
  })
})

// 未捕捉到的 catch，最後守門員XD
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;
