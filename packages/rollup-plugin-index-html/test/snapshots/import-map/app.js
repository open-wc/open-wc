console.log('Loaded: ./shared.js');

console.log('Loaded: /node_modules/foo/index.js');

console.log('Loaded: /node_modules/foo/foo.js');

console.log('Loaded: /bar-fork/bar.js');

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */

console.log('my app');

import('./index-bcce6317.js');
