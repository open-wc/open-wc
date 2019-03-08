/* eslint-disable */
import request from '../../request';

console.log(
  'meta-url-test-4.js import.meta.url correct: ' +
    import.meta.url.endsWith('/demo/lazy/import-meta/meta-url-test-4.js'),
  import.meta.url,
);

const basePath = new URL('./', import.meta.url);

request(`${basePath}../../a/b/foo.txt`)
  .then(txt => console.log(`foo.txt evaluated to: ${txt}`))
  .catch(console.error);
