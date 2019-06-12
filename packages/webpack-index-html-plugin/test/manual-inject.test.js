const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const { expect } = require('chai');
const config = require('../demo/manual-inject/webpack.config');

const outDir = path.join(__dirname, '../dist');
const indexOutput =
  '<html><head><link rel="preload" href="main.889b20bcbef01fce0e59.js" as="script"></head><body><p>Template factory</p><script type="module" src="main.889b20bcbef01fce0e59.js"></script></body></html>';

describe('manual-inject', function manualInject() {
  this.timeout(1000 * 60);

  beforeEach(() => {
    rimraf.sync(outDir);
  });

  it('works for a config with a manual injection', done => {
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

      expect(assetKeys.length).to.equal(3);
      expect(assetKeys).to.include('index.html');

      expect(assetKeys.find(k => k.startsWith('main') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('1') && k.endsWith('.js'))).to.exist;

      expect(assets['index.html'].source()).to.equal(indexOutput);

      done();
    });
  });
});
