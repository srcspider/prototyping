/** @jsx React.DOM */
unit.def('Thread.Entry', function (app) {

	return React.createClass({

		displayName: 'ThreadEntry',

		getInitialState: function () {
			return {
				title: null,
				_pendingAction: false,
				_id: null
			};
		},

		componentWillMount: function() {
			var data = this.props.model.data();
			if (data._id != null) {
				data._pendingAction = null;
			}

			this.setState(data);
		},

		render: function () {

			var state = this.state;
			var entry_title;

			if (state.title != null) {
				entry_title = <a href={"/thread/" + this.state._id}>{state.title}</a>;
			}
			else { // this.state.title == null
				entry_title = 'loading...';
			}

			var actionNodes;
			if (state._pendingAction === false) {
				actionNodes = '';
			}
			else if (state._pendingAction == null) {
				actionNodes = [
					<button key="delete" className="btn btn-xs btn-danger" onClick={this.deleteThread}>
						Delete
					</button>
				];
			}
			else { // pending action
				actionNodes = <div>{this.state._pendingAction}</div>;
			}

			return (
				<div className="app-threadentry">
					<div className="row">
						<div className="col-md-9">
							{entry_title}
						</div>
						<div className="col-md-3">
							{actionNodes}
						</div>
					</div>
				</div>
			);
		},

		deleteThread: function () {
			var model = this.props.model;
			this.setState({ _pendingAction: 'Deleting...' });
			model.destroy().then(this.props.refreshListing());
		}

	});

}).done();
