var path = require('path');
var express = require('express');
var app = express();

// load server configuration
var config = require('../server.conf.json');
if (config.keys.api == '') {
	console.log('Invalid application keys.');
	console.log('Terminating due to misconfiguration...');
	process.exit(1)
}

// setup static content
var public_files_path = __dirname + '/../' + config['public'];
app.use(express.static(public_files_path));

// very basic template information
var pkg = { name: config.name };

// example using templating language
var tplPath = path.resolve(__dirname + '/templates');

app.get('/', function(req, res) {
	var swig = require('swig');
	var tpl = swig.compileFile(tplPath + '/base.html');
	res.send(tpl({ project: pkg }));
});

// getting the server to listen to a port
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

// done.
module.exports = app;