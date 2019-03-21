/* eslint-disable */
import request from '../request';
import './b/meta-url-test-3';

console.log(
  'meta-url-test-2.js import.meta.url correct: ' +
    import.meta.url.endsWith('/demo/js/a/meta-url-test-2.js'),
  import.meta.url,
);

const basePath = new URL('./', import.meta.url);

request(`${basePath}b/foo.txt`)
  .then(txt => console.log(`foo.txt evaluated to: ${txt}`))
  .catch(console.error);
