exports.configure = function (server) {
	var db = server.db;

	var schema = db.Schema({
		title: String,
		forum: db.Schema.Types.ObjectId
	});

	// define collection
	var Thread = db.model('Thread', schema);

	return Thread;
};
