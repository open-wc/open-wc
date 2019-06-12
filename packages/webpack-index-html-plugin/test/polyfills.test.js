const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const { expect } = require('chai');
const config = require('../demo/polyfills/webpack.config');

const outDir = path.join(__dirname, '../dist');
const indexOutput =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app.889b20bcbef01fce0e59.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script src="polyfills/regenerator-runtime.748579c42b8c1f3f2c2e10ab5764d0cb.js" nomodule=""></script><script>!function(){function e(e){return new Promise(function(n,o){var t=document.createElement("script");t.onerror=function(){o(new Error("Error loading "+e))},t.onload=function(){n()},t.src=e,t.setAttribute("defer",!0),document.head.appendChild(t)})}var n=["app.889b20bcbef01fce0e59.js"],o=[];"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||o.push(e("polyfills/webcomponents.88b4b5855ede008ecad6bbdd4a69e57d.js")),o.length?Promise.all(o).then(function(){n.forEach(function(n){e(n)})}):n.forEach(function(n){e(n)})}();</script></body></html>';

describe('polyfills', function singlEntry() {
  this.timeout(1000 * 60);

  beforeEach(() => {
    rimraf.sync(outDir);
  });

  it('works for a single entry application with polyfills', done => {
    webpack(config, (err, stats) => {
      if (err) {
        throw err;
      }

      if (stats.hasErrors()) {
        throw stats.compilation.errors[0];
      }

      const { assets } = stats.compilation;
      const assetKeys = Object.keys(assets);

      assetKeys.forEach(key => {
        expect(assets[key].emitted).to.equal(true);
        expect(assets[key].existsAt).to.ok;
      });

      expect(assetKeys.length).to.equal(9);
      expect(assetKeys).to.include('index.html');
      expect(assetKeys.find(k => k.startsWith('polyfills/core-js') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('polyfills/core-js') && k.endsWith('.js.map'))).to
        .exist;
      expect(assetKeys.find(k => k.startsWith('polyfills/webcomponents') && k.endsWith('.js'))).to
        .exist;
      expect(assetKeys.find(k => k.startsWith('polyfills/webcomponents') && k.endsWith('.js.map')))
        .to.exist;
      expect(
        assetKeys.find(k => k.startsWith('polyfills/regenerator-runtime') && k.endsWith('.js')),
      ).to.exist;
      expect(
        assetKeys.find(k => k.startsWith('polyfills/regenerator-runtime') && k.endsWith('.js.map')),
      ).to.exist;
      expect(assetKeys.find(k => k.startsWith('app') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('1') && k.endsWith('.js'))).to.exist;

      expect(assets['index.html'].source()).to.equal(indexOutput);

      done();
    });
  });
});
