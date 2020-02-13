/* eslint-disable prefer-spread */
import { html } from 'lit-html';
import { transform } from './transform.js';

export const createScopedHtml = tags =>
  // eslint-disable-next-line func-names
  function() {
    // eslint-disable-next-line prefer-rest-params
    const args = Array.apply(null, arguments);
    const strings = args[0];
    const values = args.slice(1);

    return html.apply(null, [].concat([transform(strings, tags)], values));
  };
