exports.configure = function (server) {

	var app = server.app;
	var express = require('express');
	var consolidate = require('consolidate');

	// static content
	app.use(express.static(__dirname + '/public'));

	// rendering engine
	app.set('view engine', 'html');
	app.set('views', server.conf.themepath);
	app.engine('.html', consolidate.lodash);

};
