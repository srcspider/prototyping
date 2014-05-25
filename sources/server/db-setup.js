exports.configure = function (server) {
	// dependencies
	var mongoose = require('mongoose');

	// connect to mongodb
	mongoose.connect(server.conf.db.host);

	// model setup function
	server.model._list = {};
	server.model.get = function (name) {
		if (name in server.model._list)
			return server.model._list[name];
		else { // name not in server.model._list
			var model = require('./models/' + name);
			return server.model._list[name] = model.configure(server);
		}
	}

	return mongoose;
};
