import { transform } from './transform.js';

export const wrap = f => (strings, ...values) => f(...transform(strings, values));
