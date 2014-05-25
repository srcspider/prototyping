/** @jsx React.DOM */
unit.def('ClassicSpinner', function (app) {

	return app.Spinner.extend({

		animate: function () {
			this._mountpoint.innerHtml = 'Loading... ' + (new Date().getTime() / 1000);
		}

	});

}).after(['Instance']);
