var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport')


function start_the_app_and_server() {

}

module.exports = {
	app_instance: null,
	server_instance: null,
	start: function(config, done) {
		var app = express();
		server = require('http').Server(app);
		var port = process.env.PORT || config.port || 3000;

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

		// db
		var dbInitialize = require('./lib/db/dbInitialize')(config.db_name);
		if (config.environment == 'dev')
			dbInitialize.initializeComprehensively(dbInitialize.addDataForManualTesting)			
		else
			dbInitialize.initializeComprehensively();

		// passport
		app.use(flash());

		app.use(passport.initialize());
		app.use(passport.session());
		var configurePassport = require('./lib/passportFunctions');
		configurePassport(passport, config.passport_override)

		// static files 
		// app.use(express.static(__dirname + '/../../public'));

		// socket.io functions
		require('./lib/socketFunctions')(server);

		// routes (last - just before errors)
		var routes = require('./routes/index');
		var auth = require('./routes/auth')(app, passport);
		app.use('/', routes);
		app.use('/auth', auth);

		// error handling
		require('./lib/errorFunctions')(app);

		this.server_instance = server
		this.app_instance = app

		server.listen(port, function(){
		    console.log('Server inception on port:', server.address().port);
		    if (done) done()
		});
	},
	stop: function(done) {
		if (this.server_instance) this.server_instance.close(done);
	}
}