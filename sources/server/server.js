var server = {
	app: null,
	conf: null,
	env: 'production',
	model: {}
};

//// Module Dependencies ///////////////////////////////////////////////////////

var path = require('path');
var express = require('express');

var app = express();
server.app = app;

//// Server configuration //////////////////////////////////////////////////////

var conf = require('../server.conf.json');

if (conf.keys.api == '') {
	console.log('Invalid application keys.');
	console.log('Terminating due to misconfiguration...');
	process.exit(1)
}

conf.syspath = __dirname;
conf.rootpath = path.resolve(__dirname + '/..');
conf.themepath = path.resolve(conf.rootpath + conf.themepath);

server.conf = conf;

//// Environment ///////////////////////////////////////////////////////////////

app.set('port', process.env.PORT || 3000);

if ('development' == app.get('env')) {
	server.env = 'development';
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
}

// Middleware
// ----------

// ensure response uses gzip compression
// this must be before other middleware
app.use(express.compress());

// support for application/json
app.use(express.json());
// support for x-ww-form-urlencoded
app.use(express.urlencoded());

/// we intentionally do not use express multipart, which allows for
/// multipart/form-data requests since we do not need it and it causes a
/// security vulnerability; the very common express.bodyParser is a combination
/// of json, urlencoded and multipart; since we explicitly use the middleware
/// it is not included

app.use(express.methodOverride());

//// Database //////////////////////////////////////////////////////////////////

var dbsetup = require('./db-setup');
server.db = dbsetup.configure(server);

//// Routes ////////////////////////////////////////////////////////////////////

var routes = require('./routes');
routes.router(server);

//// Setup Server //////////////////////////////////////////////////////////////

var http = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', http.address().port);
    console.log('Handling requests as a', server.env, 'server');
});

// done.
module.exports = server;
