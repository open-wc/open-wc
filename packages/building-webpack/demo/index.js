import loadPolyfills from '@open-wc/polyfills-loader';

loadPolyfills().then(() => {
  import('./demo-app.js');
});
