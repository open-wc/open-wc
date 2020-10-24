/* eslint-disable global-require, import/no-dynamic-require */
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { rollup } = require('rollup');
const { startServer, createConfig } = require('es-dev-server');

const rootDir = path.resolve(__dirname, '..', 'dist');

describe('integration tests', () => {
  let server;
  let serverConfig;
  /** @type {import('puppeteer').Browser} */
  let browser;

  before(async () => {
    serverConfig = createConfig({
      port: 8081,
      rootDir,
    });

    ({ server } = await startServer(serverConfig));
    browser = await puppeteer.launch();
    rimraf.sync(rootDir);
  });

  after(async () => {
    await browser.close();
    await new Promise(resolve =>
      server.close(() => {
        resolve();
      }),
    );
  });

  describe(`Mpa Config`, function describe() {
    this.timeout(20000);
    let page;

    before(async () => {
      rimraf.sync(rootDir);
      const configPath = path.join(__dirname, '..', 'demo', 'mpa', 'rollup.mpa.config.js');
      const config = require(configPath);
      const bundle = await rollup(config);
      if (Array.isArray(config.output)) {
        await Promise.all([bundle.write(config.output[0]), bundle.write(config.output[1])]);
      } else {
        await bundle.write(config.output);
      }

      page = await browser.newPage();
    });

    after(() => {
      rimraf.sync(rootDir);
    });

    it('passes the in-browser tests for index.html', async () => {
      await page.goto('http://localhost:8081/', {
        waitUntil: 'networkidle0',
      });
      // @ts-ignore
      const browserTests = await page.evaluate(() => window.__tests);
      expect(browserTests).to.eql({
        homepageMetaUrl: 'http://localhost:8081/homepage.js',
        homepageDepMetaUrl: 'http://localhost:8081/js/homepage-dep.js',
        __homepageSideEffectMetaUrl: 'http://localhost:8081/homepage-side-effect.js',
        __homepageSideEffectDepMetaUrl: 'http://localhost:8081/js/homepage-side-effect-dep.js',
        navigationMetaUrl: 'http://localhost:8081/navigation.js',
        serviceWorkerScriptUrl: 'sw.js',
      });
    });

    it('passes the in-browser tests for subpage/index.html', async () => {
      await page.goto('http://localhost:8081/subpage/', {
        waitUntil: 'networkidle0',
      });
      // @ts-ignore
      const browserTests = await page.evaluate(() => window.__tests);
      expect(browserTests).to.eql({
        subpageMetaUrl: 'http://localhost:8081/subpage/subpage.js',
        subpageDepMetaUrl: 'http://localhost:8081/js/subpage-dep.js',
        __subpageSideEffectMetaUrl: 'http://localhost:8081/subpage/subpage-side-effect.js',
        __subpageSideEffectDepMetaUrl: 'http://localhost:8081/js/subpage-side-effect-dep.js',
        navigationMetaUrl: 'http://localhost:8081/navigation.js',
        serviceWorkerScriptUrl: '../sw.js',
      });
    });

    it('outputs a service worker', () => {
      expect(fs.existsSync(path.join(rootDir, 'sw.js'))).to.be.true;
    });
  });
});
