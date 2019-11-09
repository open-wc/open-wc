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
      [ENTER, ENTER, ENTER, workingDirName, ENTER, ENTER, ENTER],
      { timeout: 1000, maxTimeout: 300000 },
    )
      .then(() => {
        expect(fs.existsSync(workingDirPath)).to.be.true;
        done();
      })
      .catch(err => done(err));
  }).timeout(300000);
});
