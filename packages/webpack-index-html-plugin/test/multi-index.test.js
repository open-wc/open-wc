const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const { expect } = require('chai');
const config = require('../demo/multi-index/webpack.config');

const outDir = path.join(__dirname, '../dist');
const indexOutputEn =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="app-en-GB.18427125feb54217567c.js"></script></body></html>';
const indexOutputNl =
  '<html lang="nl-NL"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="app-nl-NL.22cfb3bc738120afe657.js"></script></body></html>';
const indexOutputFr =
  '<html lang="fr-FR"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="app-fr-FR.687ad1c1ed4d359b2e1c.js"></script></body></html>';
const indexOutputFallback =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="app-en-GB.18427125feb54217567c.js"></script></body></html>';
const indexOutputDemo =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="app-en-GB.18427125feb54217567c.js"></script></body></html>';

describe('multi-index', function multiIndex() {
  this.timeout(1000 * 60);

  beforeEach(() => {
    rimraf.sync(outDir);
  });

  it('works for a multi index application', done => {
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
      expect(assetKeys).to.include('index-demo.html');
      expect(assetKeys).to.include('index-en-GB.html');
      expect(assetKeys).to.include('index-nl-NL.html');
      expect(assetKeys).to.include('index-fr-FR.html');

      expect(assetKeys.find(k => k.startsWith('app-en-GB') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('app-nl-NL') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('app-fr-FR') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('3') && k.endsWith('.js'))).to.exist;

      expect(assets['index-en-GB.html'].source()).to.equal(indexOutputEn);
      expect(assets['index-nl-NL.html'].source()).to.equal(indexOutputNl);
      expect(assets['index-fr-FR.html'].source()).to.equal(indexOutputFr);
      expect(assets['index.html'].source()).to.equal(indexOutputFallback);
      expect(assets['index-demo.html'].source()).to.equal(indexOutputDemo);

      done();
    });
  });
});
