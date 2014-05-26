/** @jsx React.DOM */

// Model Basics
// ------------
// A model is merely a basic javascript object that can be instantiated either
// with data or with just an id. The model is always in one of those states,
// loaded (ie. has data), or not loaded (ie. does not have data). The load
// function is responsible for loading the data.
//
// The model will never load itself, too complicated for everyone involved,
// instead it's the responsability of the user of the model to make sure the
// model is loaded in.

unit.def('Model', function (app) {

	return app.Instance.extend({

		// is this a id-only copy?
		_shallow: true,

		// model data
		_data: {},

		id: function () {
			return this._data._id;
		},

		data: function () {
			return this._data;
		},

		build: function (input, shallow) {
			var i = this;
			i._shallow = shallow != null ? shallow : false;
			return new Promise(function (resolve, reject) {
				// if we recieve an object we assume it's a parsable serialazable
				// version of what we want, otherwise it's an id
				if (_.isObject(input)) {
					i.parse(input).then(function (data) {
						i._data = data;
						i._shallow = false;
						i.trigger('data');
						resolve(i);
					})
					.caught(function (err) {
						reject(err);
					});
				}
				else { // assume id
					i._data._id = input;
					if (shallow) {
						i._shallow = true;
						resolve(i);
					}
					else { // non-shallow
						i.load().then(function () {
							self._shallow = false;
							resolve(i);
						});
					}
				}
			});
		},

		isShallowCopy: function () {
			return this._shallow;
		},

		load: function () {

			if (this.api == null) {
				throw new Error('You must define [api] in the model or implement [load].');
			}

			var self = this;
			return new Promise(function (resolve, reject) {
				oboe(self.api + '/' + self._data._id)
					.done(function (res) {
						self.parse(res).then(function (data) {
							self._data = data;
							resolve(self);
						});
					})
					.fail(function (err) {
						reject(err.thrown);
					});
			});
		},

		parse: function (input) {
			return new Promise(function (resolve, reject) {
				resolve(input);
			});
		},

		destroy: function () {

			if (this.api == null) {
				throw new Error('You must define [api] in the model or implement [load].');
			}

			var self = this;
			return new Promise(function (resolve, reject) {
				req = {
					url: self.api + '/' + self.id(),
					method: 'DELETE'
				};
				oboe(req)
					.done(function (res) {
						if (res.status === 'success') {
							resolve();
						}
						else { // failed
							reject(new Error(res.message));
						}
					})
					.fail(function (err) {
						reject(err.thrown);
					});
			});
		},

		ready: function () {
			var self = this;
			return new Promise(function (resolve, reject) {
				if ( ! self._shallow) {
					resolve(self);
				}
				else { // we need to load in the data
					self.load().then(function () {
						self._shallow = false;
						resolve(self);
					});
				}
			});
		},

		// Event Handling
		// --------------

		_events: {},

		on: function (triggerName, callback) {
			var namespace = null;

			if (triggerName.indexOf('.') !== -1) {
				var parts = triggerName.split('.');
				triggerName = parts[0];
				namespace = parts[1];
			}

			if (this._events[triggerName] == null) {
				this._events[triggerName] = {
					unnamed: [],
					named: {}
				};
			}

			if (namespace == null) {
				this._events[triggerName].unnamed.push(callback);
			}
			else { // namespace != null
				this._events[triggerName].named[namespace] = callback;
			}

			return this;
		},

		off: function (triggerName) {
			var namespace = null;

			if (triggerName.indexOf('.') !== -1) {
				var parts = triggerName.split('.');
				triggerName = parts[0];
				namespace = parts[1];
			}

			if (namespace == null) {
				this._events[triggerName] = {
					unnamed: [],
					named: {}
				};
			}
			else { // namespace != null
				this._events[triggerName].named[namespace] = null;
			}

			return this;
		},

		trigger: function (triggerName) {
			var self = this;
			var args = [].slice.call(arguments, 1);

			if (this._events[triggerName] != null) {
				var event_runner = function (controller) {
					if (controller != null) {
						controller.apply(self, args);
					}
				};
				_.each(this._events[triggerName].unnamed, event_runner);
				_.each(this._events[triggerName].named, event_runner);
			}

			return this;
		}

	});

}).after(['Instance']);
