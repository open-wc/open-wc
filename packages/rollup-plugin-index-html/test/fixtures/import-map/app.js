/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
import './shared.js';

import 'foo';
import 'foo/foo.js';
import 'bar';

console.log('my app');

import('lazy');
