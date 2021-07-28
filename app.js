require('./models/dbConnect') // Connection a mongodb
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRoute = require('./routes/index');
var usersRoute = require('./routes/users');
var shopRoute = require('./routes/shop');
var stripeRoute = require('./routes/stripe');

var session = require("express-session");

var app = express();

// Systeme de sessions
app.use( 
  session({  
  secret: 'a4f8071f-c873-4447-8ee2', 
  resave: false, 
  saveUninitialized: false,
   }) 
);

// Moteur de template
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use('/shop', shopRoute);
app.use('/stripe', stripeRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
