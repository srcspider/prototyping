exports.router = function (server) {

	var app = server.app;
	var faker = require('../extra/Faker');

	// Error Handling

	var handleError = function (res, err) {
		res.json(err);
	};

	// Configure theme
	// ---------------

	var theme = require(server.conf.themepath + '/theme.js');
	theme.configure(server);

	// Public Routes
	// -------------

	var default_controller = function (req, res) {
		var server_info = {
			name: 'Demo App',
			year: 1900 + (new Date()).getYear(),
			livereload: server.conf.dev.livereload,
			env: server.env
		};
		res.render('index', {
			server: server_info,
			cachebust: server.env == 'production' ? 0 : Math.random()
		});
	};

	app.get('/', default_controller);
	app.get('/thread/:id', default_controller);
	app.get('/post/:id', default_controller);
	app.get('/about', default_controller);

	// Private Routes
	// --------------

	// #### Forums ############################################################

	app.get('/api/1.0/forums/:id', function (req, res) {

		// for demo purposes we'll just return the same forum every time
		// we'll call the main forum "main_forum"

		var Forum = server.model.get('Forum');
		Forum.findOne({ slugid: 'mainforum' }, { title: 1 }, function (err, main_forum) {
			if (err) {
				handleError(res, err);
			}
			else if (main_forum == null) {
				// create forum if it doesn't exist
				main_forum = new Forum({
					title: 'Main Forum',
					slugid: 'mainforum'
				});

				main_forum.save(function (err, doc) {
					if (err) {
						handleError(res, err);
					}
					else { // no error
						res.send(doc);
					}
				});
			}
			else { // main forum already exists
				res.send(main_forum);
			}
		});
	});

	// #### Threads ###########################################################

	app.post('/api/1.0/threads', function (req, res) {
		var Thread = server.model.get('Thread');
		var input = req.body

		// create thread
		var thread = new Thread({
			title: input.title,
			forum: input.forum
		});

		// save thread
		thread.save(function (err, doc) {
			if (err) {
				handleError(res, err);
			}
			else { // no error
				res.send(doc);
			}
		});
	});

	app.get('/api/1.0/threads/:id', function (req, res) {
		var Thread = server.model.get('Thread');
		Thread.findOne({ _id: req.params.id }, { __v: 0 }, function (err, thread) {
			if (err) {
				handleError(res, err);
			}
			else { // got threads
				res.send(thread);
			}
		});
	});

	app.get('/api/1.0/forums/:id/threads', function (req, res) {
		var Thread = server.model.get('Thread');
		Thread.find({ forum: req.params.id }, { __v: 0 }, function (err, threads) {
			if (err) {
				handleError(res, err);
			}
			else { // got threads
				res.send(threads);
			}
		});
	});

	app.delete('/api/1.0/threads/:id', function (req, res) {
		var Thread = server.model.get('Thread');
		Thread.remove({ _id: req.params.id }, function (err) {
			if (err) {
				handleError(res, err);
			}
			else { // no error
				res.send({ status : "success" });
			}
		});
	});

	// #### Posts #############################################################

	app.post('/api/1.0/posts', function (req, res) {
		var Post = server.model.get('Post');
		var input = req.body

		// create post
		var post = new Post({
			body: input.body,
			thread: input.thread
		});

		// save post
		post.save(function (err, doc) {
			if (err) {
				handleError(res, err);
			}
			else { // no error
				res.send(doc);
			}
		});
	});

	app.get('/api/1.0/posts/:id', function (req, res) {
		res.send({
			id: req.params.id,
			user: {
				name: faker.Internet.userName()
			},
			body: faker.Lorem.paragraphs()
		});
	});

	app.get('/api/1.0/threads/:id/posts', function (req, res) {
		var Post = server.model.get('Post');
		Post.find({ thread: req.params.id }, { __v: 0 }, function (err, posts) {
			if (err) {
				handleError(res, err);
			}
			else { // got posts
				res.send(posts);
			}
		});
	});

	app.delete('/api/1.0/posts/:id', function (req, res) {
		var Post = server.model.get('Post');
		Post.remove({ _id: req.params.id }, function (err) {
			if (err) {
				handleError(res, err);
			}
			else { // no error
				res.send({ status : "success" });
			}
		});
	});

};
