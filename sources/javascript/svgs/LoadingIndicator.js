/** @jsx React.DOM */
unit.def('svg.LoadingIndicator', function (app) {

	return React.createClass({

		displayName: 'LoadingIndicator',

		shouldComponentUpdate: function () {
			return false;
		},

		render: function () {
			return <svg className="svg-loading-indicator"></svg>;
		},

		componentDidMount: function () {
			var s = Snap(this.getDOMNode());
			var circle = s.circle(50, 50, 25);
			circle.animate({r: 50}, 250);
		}

	});

}).done();
