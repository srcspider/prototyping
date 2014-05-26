/** @jsx React.DOM */
unit.def('Post.Form', function (app) {

	return React.createClass({

		displayName: 'PostForm',

		getInitialState: function () {
			return {
				body: '',
			};
		},

		render: function () {
			return (
				<form role="form" onSubmit={this.newPost}>
					<div className="form-group">
						<textarea type="text" className="form-control"
						          autoComplete={false}
						          ref="post_body"
						          value={this.state.body}
						          onKeyUp={this.onBodyChange}
						          onChange={this.onBodyChange} />
					</div>
					<button type="submit" className="btn btn-primary">
						Publish
					</button>
				</form>
			);
		},

		reset: function () {
			this.setState({ body: '' });
		},

		onBodyChange: function (event) {
			this.setState({ body: event.target.value });
		},

		newPost: function (event) {
			event.preventDefault();

			var self = this;
			var thread = this.props.thread;

			thread.newPost({
				body: self.state.body
			}).then(function () {
				self.reset();
				self.props.refreshListing();
			});
		},

	});

}).done();
