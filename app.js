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

// express 錯誤處理 - 統一管理錯誤處理
// 自訂 production 環境錯誤 
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).send({
      message: err.message
    });
  } else {
    // log 紀錄
    console.error('出現重大錯誤', err);
    // 送出預設罐頭訊息
    res.status(500).send({
      status: 'error',
      message: '系統錯誤，請恰系統管理員'
    });
  }
};

// 自訂 dev 環境錯誤 
const resErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    message: err.message,
    error: err,
    stack: err.stack
  });
};

// 因為 windows 環境問題，需要安裝 npm 的 cross-env
// package.json 的 NODE_ENV 前面須加 cross-env
// 例如: "cross-env NODE_ENV=dev 或 cross-env NODE_ENV=production

//判斷是 dev 環境 or production 環境
app.use((err, req, res, next) => {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  };
  // production
  if (err.name === 'ValidationError') {
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res);
})

// 未捕捉到的 catch，最後守門員XD
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;
