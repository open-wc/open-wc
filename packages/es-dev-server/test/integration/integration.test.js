/* eslint-disable global-require, import/no-dynamic-require */
import { expect } from 'chai';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { startServer, createConfig } from '../../src/es-dev-server.js';

const update = process.argv.includes('--update-snapshots');
const snapshotsDir = path.join(__dirname, '..', 'snapshots', 'integration');
const testCases = ['static', 'syntax', 'node-resolve', 'babel', 'typescript'];

describe('integration tests', () => {
  testCases.forEach(testCase => {
    ['auto', 'min'].forEach(compatibility => {
      describe(`testcase ${testCase}`, () => {
        let server;
        let serverConfig;
        let browser;

        beforeEach(async () => {
          const rootDir = path.resolve(__dirname, '..', '..');
          const demoDir = path.resolve(rootDir, 'demo', testCase);
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

        it('matches the snapshot', async function test() {
          this.timeout(10000);
          const appPath = `http://localhost:8080${serverConfig.openPath}index.html`;
          const page = await browser.newPage();
          await page.goto(appPath, {
            waitUntil: 'networkidle0',
          });
          const html = await page.content();
          const name = `${testCase}-${compatibility}`;
          const filePath = path.join(snapshotsDir, `${name}.html`);

          if (update) {
            fs.writeFileSync(filePath, html);
          } else {
            if (!fs.existsSync(filePath)) {
              throw new Error(`No snapshot found for ${name}`);
            }

            expect(fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n')).to.equal(
              html.replace(/\r\n/g, '\n'),
            );
          }
        });
      });
    });
  });
});
