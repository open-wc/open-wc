/* eslint-disable global-require, import/no-dynamic-require */
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { startServer, createConfig } from '../../src/es-dev-server.js';

const unimplementedFeatures = ['optionalChaining', 'nullishCoalescing'];

const testCases = [
  {
    name: 'static',
    tests: ['moduleLoaded'],
  },
  {
    name: 'syntax',
    tests: [
      'stage4',
      'importMeta',
      'staticImports',
      'dynamicImports',
      'optionalChaining',
      'nullishCoalescing',
    ],
  },
  {
    name: 'node-resolve',
    tests: ['inlineNodeResolve', 'nodeResolve', 'noExtension', 'extensionPriority'],
  },
  {
    name: 'babel',
    tests: ['classFields', 'optionalNullish'],
  },
  {
    name: 'typescript',
    tests: ['litElement', 'extensionPriority'],
  },
];

describe('integration tests', () => {
  testCases.forEach(testCase => {
    ['auto', 'min', 'always'].forEach(compatibility => {
      describe(`testcase ${testCase.name}-${compatibility}`, () => {
        let server;
        let serverConfig;
        /** @type {import('puppeteer').Browser} */
        let browser;

        beforeEach(async () => {
          const rootDir = path.resolve(__dirname, '..', '..');
          const demoDir = path.resolve(rootDir, 'demo', testCase.name);
          const configPath = path.resolve(demoDir, 'server.js');
          const userConfig = fs.existsSync(configPath) ? require(configPath) : {};
          serverConfig = createConfig({
            port: 8080,
            compatibility,
            ...userConfig,
          });

          ({ server } = await startServer(serverConfig));
          browser = await puppeteer.launch();
        });

        afterEach(async () => {
          await browser.close();
          await new Promise(resolve =>
            server.close(() => {
              resolve();
            }),
          );
        });

        it('passes the in-browser tests', async function it() {
          this.timeout(10000);
          const appPath = `http://localhost:8080${serverConfig.openPath}index.html`;
          const page = await browser.newPage();
          await page.goto(appPath, {
            waitUntil: 'networkidle0',
          });

          // @ts-ignore
          const browserTests = await page.evaluate(() => window.__tests);

          // the demos run "tests", which we check here
          testCase.tests.forEach(test => {
            if (compatibility === 'auto' && unimplementedFeatures.includes(test)) {
              return;
            }

            if (!browserTests[test]) {
              throw new Error(`Expected test ${test} to have passed in the browser.`);
            }
          });
        });
      });
    });
  });
});
