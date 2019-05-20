/* eslint-disable */
import { foo } from './module-b.js';

console.log('module a');
console.log(foo());

for (let i = 0; i < 30; i++) {
  import(`./a/a-${i + 1}.js`);
}
