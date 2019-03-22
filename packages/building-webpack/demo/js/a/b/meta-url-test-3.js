/* eslint-disable */
import request from '../../request';

console.log(
  'meta-url-test-3.js import.meta.url correct: ' +
    import.meta.url.endsWith('/demo/lazy/import-meta/meta-url-test-3.js'),
  import.meta.url,
);

const basePath = new URL('./', import.meta.url);

request(`${basePath}foo.txt`)
  .then(txt => console.log(`foo.txt evaluated to: ${txt}`))
  .catch(console.error);
