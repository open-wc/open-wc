/* eslint-disable */
import { foo } from './module-b.js';

const object = {};

console.log('module a');
console.log(foo());
console.log('optional chaining + nullish coalesc: ', object?.foo?.bar ?? 'fallback');
