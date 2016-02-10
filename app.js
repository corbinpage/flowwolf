var express = require('express');
var path = require('path');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var hbs = require('hbs');

GLOBAL._ = require('underscore');
GLOBAL._s = require('underscore.string');
global.__base = __dirname + '/';

var models = require(__base + 'app/models/index');


var routes = require(__base + 'app/routes/routes');

// Configure the Basic strategy for use by Passport.
//
// The Basic strategy requires a `verify` function which receives the
// credentials (`username` and `password`) contained in the request.  The
// function must verify that the password is correct and then invoke `cb` with
// a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new BasicStrategy(
  function(username, password, cb) {
    models.User.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

var app = express();

// view engine setup
app.set('views', path.join(__base, 'app/views'));

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
hbs.registerPartials(path.join(__base, 'app/views/rule'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__base, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__base, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      layout: 'layout/default'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    layout: 'layout/default'
  });
});


module.exports = app;