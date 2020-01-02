import { html as htmlRoot } from '../../../../node_modules/lit-html/lit-html.js';
import { cache as cacheRoot } from '../../../../node_modules/lit-html/directives/cache.js';
import { html as htmlBare } from 'lit-html';
import { cache as cacheBare } from 'lit-html/directives/cache.js';

document.getElementById('test').innerHTML = `
  <p>Deduplicated bare import: ${htmlRoot === htmlBare}</p>
  <p>Deduplicated nested bare import: ${cacheRoot === cacheBare}</p>
`;