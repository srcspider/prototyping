/** @jsx React.DOM */
unit.def('Application', function (app) {

	return React.createClass({

		displayName: 'Application',

		getInitialState: function () {
			return {
				page: null
			};
		},

		render: function () {
			return <div>{this.state.page}</div>;
		},

		mount: function (page) {
			this.setState({ page: page });
		}

	});

}).done();
