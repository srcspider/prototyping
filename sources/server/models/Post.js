exports.configure = function (server) {
	var db = server.db;

	var schema = db.Schema({
		body: String,
		thread: db.Schema.Types.ObjectId
	});

	// define collection
	var Post = db.model('Post', schema);

	return Post;
};
