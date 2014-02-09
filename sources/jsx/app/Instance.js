/** @jsx React.DOM */
app.Instance = Class.extend({

//// Event Handling ////////////////////////////////////////////////////////////

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
					console.log(controller);
					controller.apply(self, args);
				}
			};
			_.each(this._events[triggerName].unnamed, event_runner);
			_.each(this._events[triggerName].named, event_runner);
		}

		return this;
	}

});
