/** @jsx React.DOM */
unit.def('Thread.Model', function (app) {

	return app.Model.extend({

		api: server.api + '/threads',

		_data: {
			title: ''
		},

		newPost: function (data) {
			var self = this;
			data.thread = this.id();
			return new Promise(function (resolve, reject) {
				var req = {
					method: 'POST',
					url: server.api + '/posts',
					body: data,
				};
				oboe(req)
					.done(function (res) {
						app.Post.Model.instance(res).then(function (thread) {
							self.trigger('data');
							resolve(thread);
						});
					})
					.fail(function (err) {
						reject(err.thrown);
					});
			});
		},

		posts: function () {
			var self = this;
			return new Promise(function (resolve, reject) {
				oboe(server.api + '/threads/' + self.id() + '/posts')
					.done(function (res) {
						var posts$ = _.map(res, function (post) {
							return app.Post.Model.instance(post);
						});
						Promise.all(posts$).then(function (posts) {
							resolve(posts);
						});
					})
					.fail(function (err) {
						reject(err.thrown);
					});
			});
		},

	});

}).after(['Model']);
