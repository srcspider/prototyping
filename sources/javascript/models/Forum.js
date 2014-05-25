/** @jsx React.DOM */
unit.def('Forum.Model', function (app) {

	return app.Model.extend({

		api: server.api + '/forums',

		_data: {
			title: ''
		},

		newThread: function (data) {
			var self = this;
			data.forum = this.id();
			return new Promise(function (resolve, reject) {
				var req = {
					method: 'POST',
					url: server.api + '/threads',
					body: data
				};
				oboe(req)
					.done(function (res) {
						app.Thread.Model.instance(res).then(function (thread) {
							self.trigger('data');
							resolve(thread);
						});
					})
					.fail(function (err) {
						reject(err.thrown);
					});
			});
		},

		threads: function () {
			var self = this;
			return new Promise(function (resolve, reject) {
				oboe(server.api + '/forums/' + self.id() + '/threads')
					.done(function (res) {
						var threads$ = _.map(res, function (thread) {
							return app.Thread.Model.instance(thread);
						});
						Promise.all(threads$).then(function (threads) {
							resolve(threads);
						});
					})
					.fail(function (err) {
						reject(err.thrown);
					});
			});
		}

	});

}).after(['Model', 'Thread.Model']);
