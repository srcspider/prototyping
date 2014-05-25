/** @jsx React.DOM */
unit.def('Spinner', function (app) {

	return app.Instance.extend({

		// dom element that holds the animation
		_mountpoint: null,

		// animation id
		_animationID: null,

		init: function (mountpoint) {
			this._mountpoint = mountpoint;
		},

		animate: function () {
			throw new Error("Missing animation logic.");
		},

		cleanup: function () {
			this._mountpoint.innerHtml = '';
		},

		start: function () {
			var self = this;
			var animate = window.requestAnimationFrame;

			var loop = function () {
				self.animate();
				// store id so we can stop the animation
				self._animationID = animate(loop);
			};

			loop();
		},

		stop: function () {
			var self = this;
			return new Promise(function (resolve, reject) {
				window.cancelAnimationFrame(self._animationID);
				self.cleanup();
				resolve();
			});
		}

	});

}).after(['Instance']);
