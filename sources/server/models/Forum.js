exports.configure = function (server) {
	var db = server.db;

	var schema = db.Schema({
		title: String,
		slugid: String
	});

	// define collection
	var Forum = db.model('Forum', schema);

	return Forum;
};
