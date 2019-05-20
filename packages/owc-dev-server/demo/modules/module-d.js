/* eslint-disable */
import './module-e.js';

for (let i = 0; i < 10; i++) {
  import(`./d/d-${i + 1}.js`);
}
