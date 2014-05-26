/** @jsx React.DOM */
unit.def('Forum.View', function (app) {

	var ThreadEntry = app.Thread.Entry;
	var ThreadForm = app.Thread.Form;

	return React.createClass({

		displayName: 'Forum',

		getInitialState: function () {
			return {
				threads: { data: [], ready: false }
			};
		},

		componentWillMount: function () {
			var self = this;
			var model = this.props.model;

			model.on('data.forum', function () {
				self.setState(model.data());
			});

			this.refresh();
		},

		componentWillUnmount: function () {
			var model = this.props.model;
			model.off('data.forum');
		},

		refresh: function () {
			var self = this;
			var model = this.props.model;
			this.setState(model.data());
			model.threads().then(function (data) {
				var threads = _.map(data, function (thread) {
					return <ThreadEntry key={'thread'+thread.id()} model={thread} refreshListing={self.refresh} />;
				});
				self.setState({ threads: { data: threads, ready: true } });
			});
		},

		render: function () {
			var state = this.state;

			var threadNodes;
			if (this.state.threads.ready) {
				threadNodes = _.map(this.state.threads.data, function (node) {
					return <div><hr/>{node}</div>;
				});
				if (threadNodes.length === 0) {
					threadNodes = <div className="empty-state">There are currently no threads.</div>;
				}
			}
			else { // threads still loading
				threadNodes = '';
			}

			// render template
			return (
				<div className="thread">
					<h2>{state.title}</h2>
					{threadNodes}
					<ThreadForm forum={this.props.model} refreshListing={this.refresh} />
				</div>
			);
		},

	});

}).after([
	'Thread.Entry',
	'Thread.Form'
]);
