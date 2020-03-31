System.register([], function (exports, module) {
	'use strict';
	return {
		execute: function () {

			console.log('shared');

			console.log('my app');

			module.import('./lazy-c54dffe7.js');

		}
	};
});
