/** @jsx React.DOM */
unit.def('Post.View', function (app) {

	return React.createClass({

		displayName: 'Post',

		getInitialState: function () {
			return {
				_id: '',
				body: '',
				_pendingAction: null,
			};
		},

		componentWillMount: function() {
			var self = this;
			var model = this.props.model;

			model.on('data.post', function () {
				self.setState(model.data());
			});

			this.refresh();
		},

		componentWillUnmount: function () {
			var model = this.props.model;
			model.off('data.post');
		},

		refresh: function () {
			this.setState(this.props.model.data());
		},

		render: function () {
			var state = this.state;

			var actions;
			if (state._pendingAction == null) {
				actions = [
					<button key="delete" onClick={this.deletePost} className="btn btn-danger">Delete</button>
				];
			}
			else { // action ongoing
				actions = state._pendingAction;
			}

			return (
				<div className="app-post">
					<div className="row">
						<div className="col-md-12">
							#<a href={"/post/" + state._id}>
								{state._id}
							</a>
						</div>
					</div>
					<div className="row">
						<div className="col-md-9 app-post-body">
							{state.body}
						</div>
						<div className="col-md-3 app-post-sidebar">
							{actions}
						</div>
					</div>
				</div>
			);
		},

		deletePost: function () {
			var model = this.props.model;
			this.setState({ _pendingAction: 'Deleting...' });
			model.destroy().then(this.props.refreshListing());
		}

	});

}).done();
