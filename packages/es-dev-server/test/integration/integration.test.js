/* eslint-disable global-require, import/no-dynamic-require */
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { startServer, createConfig } from '../../src/es-dev-server.js';

const unimplementedFeatures = ['optionalChaining', 'nullishCoalescing'];

const testCases = [
  {
    name: 'static',
    pages: [''],
    tests: ['moduleLoaded'],
  },
  {
    name: 'syntax',
    pages: [''],
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
    pages: [''],
    tests: ['inlineNodeResolve', 'nodeResolve', 'noExtension', 'extensionPriority'],
  },
  {
    name: 'babel',
    pages: [''],
    tests: ['classFields', 'optionalNullish'],
  },
  {
    name: 'typescript',
    pages: [''],
    tests: ['litElement', 'extensionPriority'],
  },
  {
    name: 'multi-page',
    pages: [
      'packages/es-dev-server/demo/multi-page/',
      'packages/es-dev-server/demo/multi-page/page-a/',
      'packages/es-dev-server/demo/multi-page/page-a/sub-page/',
    ],
    tests: ['inline', 'moduleA', 'moduleB'],
  },
];

describe('integration tests', () => {
  testCases.forEach(testCase => {
    ['auto', 'none', 'min', 'max'].forEach(compatibility => {
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

        testCase.pages.forEach(pageUrl => {
          it(`passes the in-browser tests for page ${pageUrl}`, async function it() {
            this.timeout(10000);

            const appPath = `http://localhost:8080${serverConfig.openPath}${pageUrl}`;
            const page = await browser.newPage();
            await page.goto(appPath, {
              waitUntil: 'networkidle0',
            });

            // @ts-ignore
            const browserTests = await page.evaluate(() => window.__tests);

            // the demos run "tests", which we check here
            testCase.tests.forEach(test => {
              if (
                (compatibility === 'auto' || compatibility === 'none') &&
                unimplementedFeatures.includes(test)
              ) {
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
});
