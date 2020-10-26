/* eslint-disable global-require, import/no-dynamic-require */
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { rollup } = require('rollup');
const { startDevServer } = require('@web/dev-server');

const rootDir = path.resolve(__dirname, '..', 'dist');

describe('integration tests', () => {
  let server;
  /** @type {import('puppeteer').Browser} */
  let browser;

  before(async () => {
    server = await startDevServer({
      config: {
        port: 8081,
        rootDir,
      },
      readCliArgs: false,
      readFileConfig: false,
      logStartMessage: false,
      clearTerminalOnReload: false,
    });
    browser = await puppeteer.launch();
    rimraf.sync(rootDir);
  });

  after(async () => {
    await browser.close();
    await server.stop();
  });

  describe(`Mpa Config`, function describe() {
    this.timeout(30000);
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
