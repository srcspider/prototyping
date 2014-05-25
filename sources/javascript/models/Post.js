/** @jsx React.DOM */
unit.def('Post.Model', function (app) {

	return app.Model.extend({

		api: server.api + '/posts',

		_data: {
			_id: '',
			body: ''
		}

	});

}).after(['Model']);
