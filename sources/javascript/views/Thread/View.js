/** @jsx React.DOM */
unit.def('Thread.View', function (app) {

	var Post = app.Post.View;
	var PostForm = app.Post.Form;

	return React.createClass({

		displayName: 'Thread',

		getInitialState: function () {
			return {
				posts: { data: [], ready: false }
			};
		},

		componentWillMount: function() {
			var self = this;
			var model = this.props.model;

			model.on('data.thread', function () {
				self.setState(model.data());
			});

			this.refresh();
		},

		componentWillUnmount: function () {
			var model = this.props.model;
			model.off('data.thread');
		},

		refresh: function () {
			var self = this;
			var model = this.props.model;
			this.setState(model.data());
			model.posts().then(function (data) {
				var posts = _.map(data, function (post) {
					return <Post key={post.key()} model={post} refreshListing={self.refresh} />;
				});
				self.setState({ posts: { data: posts, ready: true } });
			});
		},

		render: function () {
			var self = this;
			var state = this.state;

			var postNodes;
			if (state.posts.ready) {
				postNodes = _.map(this.state.posts.data, function (post) {
					return <div><hr/>{post}</div>;
				});
				if (postNodes.length === 0) {
					postNodes = <div className="empty-state">There are currently no posts.</div>;
				}
			}
			else { // posts still loading
				postNodes = '';
			}

			return (
				<div className="app-thread">
					<h2>{state.title}</h2>
					{postNodes}
					<hr/>
					<div className="row">
						<div className="col-md-12">
							<PostForm thread={self.props.model} refreshListing={self.refresh}/>
						</div>
					</div>
				</div>
			);
		},

	});

}).after(['Post.View', 'Post.Form']);
