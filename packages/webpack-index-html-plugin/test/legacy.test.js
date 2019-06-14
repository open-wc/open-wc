const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const { expect } = require('chai');
const config = require('../demo/legacy/webpack.config');

const outDir = path.join(__dirname, '../dist');
const indexOutput =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app.889b20bcbef01fce0e59.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script>!function(){function e(e){return new Promise(function(n,o){var t=document.createElement("script");t.onerror=function(){o(new Error("Error loading "+e))},t.onload=function(){n()},t.src=e,t.setAttribute("defer",!0),document.head.appendChild(t)})}var n="noModule"in HTMLScriptElement.prototype?["app.889b20bcbef01fce0e59.js"]:["legacy/app.9971729f3b76ac163f0f.js"],o=[];"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||o.push(e("polyfills/webcomponents.88b4b5855ede008ecad6bbdd4a69e57d.js")),o.length?Promise.all(o).then(function(){n.forEach(function(n){e(n)})}):n.forEach(function(n){e(n)})}();</script></body></html>';

describe('legacy', function legacyEntry() {
  this.timeout(1000 * 60);

  beforeEach(() => {
    rimraf.sync(outDir);
  });

  it('works for a single entry application with legacy build', done => {
    webpack(config, (err, multiStats) => {
      if (err) {
        throw err;
      }

      const stats = multiStats.stats[0];
      const legacyStats = multiStats.stats[1];

      if (stats.hasErrors()) {
        throw stats.compilation.errors[0];
      }

      if (legacyStats.hasErrors()) {
        throw legacyStats.compilation.errors[0];
      }

      const { assets } = stats.compilation;
      const { assets: legacyAssets } = legacyStats.compilation;
      const assetKeys = Object.keys(assets);
      const legacyAssetKeys = Object.keys(legacyAssets);

      assetKeys.forEach(key => {
        expect(assets[key].emitted).to.equal(true);
        expect(assets[key].existsAt).to.ok;
      });

      expect(assetKeys.length).to.equal(7);
      expect(legacyAssetKeys.length).to.equal(2);
      expect(assetKeys).to.include('index.html');
      expect(legacyAssetKeys).to.not.include('index.html');

      expect(assetKeys.find(k => k.startsWith('polyfills/core-js') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('polyfills/core-js') && k.endsWith('.js.map'))).to
        .exist;
      expect(
        legacyAssetKeys.find(k => k.startsWith('polyfills/webcomponents') && k.endsWith('.js')),
      ).to.not.exist;
      expect(
        legacyAssetKeys.find(k => k.startsWith('polyfills/webcomponents') && k.endsWith('.js.map')),
      ).to.not.exist;

      expect(assetKeys.find(k => k.startsWith('app') && k.endsWith('.js'))).to.exist;
      expect(legacyAssetKeys.find(k => k.startsWith('legacy/app') && k.endsWith('.js'))).to.exist;

      expect(assetKeys.find(k => k.startsWith('1') && k.endsWith('.js'))).to.exist;
      expect(legacyAssetKeys.find(k => k.startsWith('legacy/1') && k.endsWith('.js'))).to.exist;

      expect(assets['index.html'].source()).to.equal(indexOutput);

      done();
    });
  });
});
