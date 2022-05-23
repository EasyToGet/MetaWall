var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { notFound } = require('./service/http');

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

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
app.use('/users', usersRouter);
app.use(notFound);

module.exports = app;
