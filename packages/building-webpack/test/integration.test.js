/* eslint-disable global-require, import/no-dynamic-require */
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const rimraf = require('rimraf');
const { startServer, createConfig } = require('es-dev-server');

const rootDir = path.resolve(__dirname, '..', 'dist');
const testCases = ['js', 'ts-babel'];

function compileAsync(config) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);

    const cb = (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    };

    compiler.run(cb);
  });
}

describe('integration tests', () => {
  let server;
  let serverConfig;
  /** @type {import('puppeteer').Browser} */
  let browser;

  before(async () => {
    serverConfig = createConfig({
      port: 8082,
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
          const configName = mode === 'modern' ? 'webpack.modern.config.js' : 'webpack.config.js';
          const configPath = path.join(__dirname, '..', 'demo', testCase, configName);
          const config = require(configPath);

          if (Array.isArray(config)) {
            await compileAsync(config[0]);
            await compileAsync(config[1]);
          } else {
            await compileAsync(config);
          }

          page = await browser.newPage();
          await page.goto('http://localhost:8082/', {
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
