/** @jsx React.DOM */
unit.def('Thread.Form', function (app) {

	return React.createClass({

		displayName: 'ThreadForm',

		getInitialState: function () {
			return {
				title: '',
			};
		},

		render: function () {
			return (
				<div className="app-newthread">
					<div className="row">
						<div className="col-md-12">
							<hr/>
							<h3>Create New Thread</h3>
							<form role="form" onSubmit={this.newThread}>
								<div className="form-group">
									<label htmlFor="thread_title">Thread Title</label>
									<input type="text" className="form-control"
									       id="thread_title" autoComplete={false}
									       ref="title" value={this.state.title}
									       onKeyUp={this.onTitleChange}
									       onChange={this.onTitleChange}
									       placeholder="Enter Thread Title" />
								</div>
								<button type="submit" className="btn btn-primary">Publish</button>
							</form>
						</div>
					</div>
				</div>
			);
		},

		reset: function () {
			this.setState({ title: '' });
		},

		onTitleChange: function (event) {
			this.setState({ title: event.target.value });
		},

		newThread: function (event) {
			event.preventDefault();

			var self = this;
			var forum = this.props.forum;

			forum.newThread({
				title: self.state.title
			}).then(function () {
				self.reset();
				self.props.refreshListing();
			});
		},

	});

}).done();
