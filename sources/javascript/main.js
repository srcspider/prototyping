/** @jsx React.DOM */

unit.selfdebug(1.5);
//unit.verbose(true);

//*
	// development debug:
	Promise.onPossiblyUnhandledRejection(function(error){
		throw error;
	});
/*/
	// production debug:
	Promise.longStackTraces();
//*/



// Render base structure
// ---------------------

unit.run(function (app) {

	var main_forum = 1;

	// mounting handlers
	// -----------------

	var mountPoint = document.getElementById('app-jsx-mountpoint');
	mountPoint.innerHTML = "Loading...";

	var Application = app.Application;
	var application = React.renderComponent(<Application />, mountPoint);

	// controllers
	// -----------

	var show_forum = function (ctx, next) {
		console.log('page: forum');
		var Forum = app.Forum.View;
		var model$ = app.Forum.Model.instance(main_forum);
		model$.then(function (model) {
			application.mount(<Forum model={model} />);
		});
	};

	var show_thread = function (ctx, next) {
		console.log('page: thread');
		var Thread = app.Thread.View;
		var model$ = app.Thread.Model.instance(ctx.params.id);
		model$.then(function (model) {
			application.mount(<Thread model={model} />);
		});
	};

	var notfound = function () {
		console.log('page: notfound');
		application.mount(<h1>404 - Page Not Found</h1>);
	};

	// routes
	// ------

	page('/', show_forum);
	page('/thread/:id', show_thread);
	page('*', notfound);
	page();

}).after([
	'Application',
	'Forum.View',
	'Forum.Model',
	'Thread.View',
	'Thread.Model',
]);

