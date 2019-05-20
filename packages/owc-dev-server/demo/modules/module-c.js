/* eslint-disable */
import './module-d.js';

for (let i = 0; i < 10; i++) {
  import(`./c/c-${i + 1}.js`);
}
