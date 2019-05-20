/* eslint-disable */
import './module-c.js';

export const foo = () => 'module b foo';

console.log('module b');

for (let i = 0; i < 30; i++) {
  import(`./b/b-${i + 1}.js`);
}
