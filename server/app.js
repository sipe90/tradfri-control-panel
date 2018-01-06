let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let index = require('./routes/index');
let users = require('./routes/users');

let app = express();

let isDevEnv = app.get('env') === 'development';

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/users', users);

app.use((req, res, next) => {
  res.status = 404;
  res.json({
    error: "Not Found"
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: isDevEnv ? err.message : "Internal server error",
    stack: isDevEnv ? err.stack : undefined
  });
});

module.exports = app;
