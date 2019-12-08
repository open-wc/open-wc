/* eslint-disable global-require, import/no-dynamic-require */
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { rollup } = require('rollup');
const { startServer, createConfig } = require('es-dev-server');

const rootDir = path.resolve(__dirname, '..', 'dist');
const testCases = ['js', 'ts-babel'];

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

  testCases.forEach(testCase => {
    ['modern', 'modern-and-legacy'].forEach(mode => {
      describe(`testcase ${testCase}-${mode}`, function describe() {
        this.timeout(10000);
        let page;

        before(async () => {
          const configName = mode === 'modern' ? 'rollup.modern.config.js' : 'rollup.config.js';
          const configPath = path.join(__dirname, '..', 'demo', testCase, configName);
          const config = require(configPath);

          if (Array.isArray(config)) {
            const bundles = await Promise.all([rollup(config[0]), rollup(config[1])]);
            await bundles[0].write(config[0].output);
            await bundles[1].write(config[1].output);
          } else {
            const bundle = await rollup(config);
            await bundle.write(config.output);
          }

          page = await browser.newPage();
          await page.goto('http://localhost:8081/', {
            waitUntil: 'networkidle0',
          });
        });

        after(() => {
          rimraf.sync(rootDir);
        });

        it('passes the in-browser tests', async () => {
          // @ts-ignore
          const browserTests = await page.evaluate(() => window.__tests);
          expect(browserTests).to.eql({
            partialCSS: true,
            litElement: true,
            startsWith: true,
            map: true,
            importMeta: true,
            importMeta2: true,
            asyncFunction: true,
            forOf: true,
            optionalChaining: true,
            nullishCoalescing: true,
          });
        });

        it('outputs a service worker', () => {
          expect(fs.existsSync(path.join(rootDir, 'sw.js'))).to.be.true;
        });
      });
    });
  });
});
