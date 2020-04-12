System.register([], function (exports, module) {
	'use strict';
	return {
		execute: function () {

			console.log('shared');

			console.log('my app');

			module.import('./lazy-30aa5246.js');

		}
	};
});
