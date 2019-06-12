const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const { expect } = require('chai');
const config = require('../demo/legacy-multi-index/webpack.config');

const outDir = path.join(__dirname, '../dist');
const indexOutputEn =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app-en-GB.18427125feb54217567c.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script>!function(){function e(e){return new Promise(function(n,o){var t=document.createElement("script");t.onerror=function(){o(new Error("Error loading "+e))},t.onload=function(){n()},t.src=e,t.setAttribute("defer",!0),document.head.appendChild(t)})}var n="noModule"in HTMLScriptElement.prototype?["app-en-GB.18427125feb54217567c.js"]:["legacy/app-en-GB.6a2b8add8d9c81bebc42.js"],o=[];"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||o.push(e("polyfills/webcomponents.88b4b5855ede008ecad6bbdd4a69e57d.js")),o.length?Promise.all(o).then(function(){n.forEach(function(n){e(n)})}):n.forEach(function(n){e(n)})}();</script></body></html>';
const indexOutputNl =
  '<html lang="nl-NL"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app-nl-NL.22cfb3bc738120afe657.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script>!function(){function e(e){return new Promise(function(n,o){var t=document.createElement("script");t.onerror=function(){o(new Error("Error loading "+e))},t.onload=function(){n()},t.src=e,t.setAttribute("defer",!0),document.head.appendChild(t)})}var n="noModule"in HTMLScriptElement.prototype?["app-nl-NL.22cfb3bc738120afe657.js"]:["legacy/app-nl-NL.38546dd0f0be1027c7b7.js"],o=[];"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||o.push(e("polyfills/webcomponents.88b4b5855ede008ecad6bbdd4a69e57d.js")),o.length?Promise.all(o).then(function(){n.forEach(function(n){e(n)})}):n.forEach(function(n){e(n)})}();</script></body></html>';
const indexOutputFr =
  '<html lang="fr-FR"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app-fr-FR.687ad1c1ed4d359b2e1c.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script>!function(){function e(e){return new Promise(function(n,o){var t=document.createElement("script");t.onerror=function(){o(new Error("Error loading "+e))},t.onload=function(){n()},t.src=e,t.setAttribute("defer",!0),document.head.appendChild(t)})}var n="noModule"in HTMLScriptElement.prototype?["app-fr-FR.687ad1c1ed4d359b2e1c.js"]:["legacy/app-fr-FR.701695f44b6e86d94465.js"],o=[];"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||o.push(e("polyfills/webcomponents.88b4b5855ede008ecad6bbdd4a69e57d.js")),o.length?Promise.all(o).then(function(){n.forEach(function(n){e(n)})}):n.forEach(function(n){e(n)})}();</script></body></html>';
const indexOutputFallback =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app-en-GB.18427125feb54217567c.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script>!function(){function e(e){return new Promise(function(n,o){var t=document.createElement("script");t.onerror=function(){o(new Error("Error loading "+e))},t.onload=function(){n()},t.src=e,t.setAttribute("defer",!0),document.head.appendChild(t)})}var n="noModule"in HTMLScriptElement.prototype?["app-en-GB.18427125feb54217567c.js"]:["legacy/app-en-GB.6a2b8add8d9c81bebc42.js"],o=[];"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||o.push(e("polyfills/webcomponents.88b4b5855ede008ecad6bbdd4a69e57d.js")),o.length?Promise.all(o).then(function(){n.forEach(function(n){e(n)})}):n.forEach(function(n){e(n)})}();</script></body></html>';
const indexOutputDemo =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app-en-GB.18427125feb54217567c.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script>!function(){function e(e){return new Promise(function(n,o){var t=document.createElement("script");t.onerror=function(){o(new Error("Error loading "+e))},t.onload=function(){n()},t.src=e,t.setAttribute("defer",!0),document.head.appendChild(t)})}var n="noModule"in HTMLScriptElement.prototype?["app-en-GB.18427125feb54217567c.js"]:["legacy/app-en-GB.6a2b8add8d9c81bebc42.js"],o=[];"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||o.push(e("polyfills/webcomponents.88b4b5855ede008ecad6bbdd4a69e57d.js")),o.length?Promise.all(o).then(function(){n.forEach(function(n){e(n)})}):n.forEach(function(n){e(n)})}();</script></body></html>';

describe('legacy multi index', function legacyMultiIndex() {
  this.timeout(1000 * 60);

  beforeEach(() => {
    rimraf.sync(outDir);
  });

  it('works for a multi index application with legacy build', done => {
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

      expect(assetKeys.length).to.equal(13);
      expect(legacyAssetKeys.length).to.equal(4);

      expect(assetKeys).to.include('index.html');
      expect(assetKeys).to.include('index-demo.html');
      expect(assetKeys).to.include('index-en-GB.html');
      expect(assetKeys).to.include('index-nl-NL.html');
      expect(assetKeys).to.include('index-fr-FR.html');
      expect(legacyAssetKeys).to.not.include('index.html');
      expect(legacyAssetKeys).to.not.include('index-demo.html');
      expect(legacyAssetKeys).to.not.include('index-en-GB.html');
      expect(legacyAssetKeys).to.not.include('index-nl-NL.html');
      expect(legacyAssetKeys).to.not.include('index-fr-FR.html');

      expect(assetKeys.find(k => k.startsWith('polyfills/core-js') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('polyfills/core-js') && k.endsWith('.js.map'))).to
        .exist;
      expect(
        legacyAssetKeys.find(k => k.startsWith('polyfills/webcomponents') && k.endsWith('.js')),
      ).to.not.exist;
      expect(
        legacyAssetKeys.find(k => k.startsWith('polyfills/webcomponents') && k.endsWith('.js.map')),
      ).to.not.exist;

      expect(assetKeys.find(k => k.startsWith('app-en-GB') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('app-nl-NL') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('app-fr-FR') && k.endsWith('.js'))).to.exist;
      expect(legacyAssetKeys.find(k => k.startsWith('legacy/app-en-GB') && k.endsWith('.js'))).to
        .exist;
      expect(legacyAssetKeys.find(k => k.startsWith('legacy/app-nl-NL') && k.endsWith('.js'))).to
        .exist;
      expect(legacyAssetKeys.find(k => k.startsWith('legacy/app-fr-FR') && k.endsWith('.js'))).to
        .exist;

      expect(assetKeys.find(k => k.startsWith('3') && k.endsWith('.js'))).to.exist;
      expect(legacyAssetKeys.find(k => k.startsWith('legacy/3') && k.endsWith('.js'))).to.exist;

      expect(assets['index-en-GB.html'].source()).to.equal(indexOutputEn);
      expect(assets['index-nl-NL.html'].source()).to.equal(indexOutputNl);
      expect(assets['index-fr-FR.html'].source()).to.equal(indexOutputFr);
      expect(assets['index.html'].source()).to.equal(indexOutputFallback);
      expect(assets['index-demo.html'].source()).to.equal(indexOutputDemo);

      done();
    });
  });
});
