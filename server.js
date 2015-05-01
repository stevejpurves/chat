var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(require('./lib/session').sessionMiddleware);

// passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require('./lib/passportFunctions');

// static files
app.use(express.static(__dirname + '/../../public'));

// socket.io functions
require('./lib/socketFunctions')(server);

// routes (last - just before errors)
var routes = require('./routes/index');
var auth = require('./routes/auth')(app, passport);
app.use('/', routes);
app.use('/auth', auth);

// error handling
require('./lib/errorFunctions')(app);

server.listen(port, function(){
    console.log('Server inception on port:', server.address().port);
});

