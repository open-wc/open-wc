import chai from 'chai';

import { executeWithInput, ENTER } from './cmd/cmd';
import fs from 'fs';

const { expect } = chai;

const workingDirName = 'test-work-dir';
const workingDirPath = './' + workingDirName;

afterEach(() => {
  if (fs.existsSync(workingDirPath)) {
    fs.rmdirSync(workingDirPath, { recursive: true });
  }
});

describe('create component', () => {
  it('use default options', function(done) {
    executeWithInput(
      '.\\dist\\create.js',
      [],
      [
        {
          key: ENTER,
          description: 'Scaffold a new project',
        },
        {
          key: ENTER,
          description: 'Select component template',
        },
        {
          key: ENTER,
          description: "Don't add anything",
        },
        {
          key: { code: workingDirName, name: 'Component name' },
          description: 'Enter component name',
        },
        {
          key: ENTER,
          description: 'Confirm name',
        },
        {
          key: ENTER,
          description: 'Write structure to disk',
        },
        {
          key: ENTER,
          description: 'Do not install dependencies',
        },
      ],
      { env: { DEBUG: true }, timeout: 1000, maxTimeout: 10000 },
    )
      .then(() => {
        expect(fs.existsSync(workingDirPath)).to.be.true;
        done();
      })
      .catch(err => done(err));
  }).timeout(20000);
});
