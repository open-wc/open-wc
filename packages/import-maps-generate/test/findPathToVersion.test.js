import chai from 'chai';
import fs from 'fs';
import * as lockfile from '@yarnpkg/lockfile';
import { findPathToVersion } from '../src/findPathToVersion';

const { expect } = chai;

describe('findPathToVersion', () => {
  it('returns the path to a specific nested version', async () => {
    const targetPath = `${__dirname}/assets/exampleNestedResolution/`;
    const yarnLockString = fs.readFileSync(`${targetPath}/yarn.lock`, 'utf-8');
    const yarnLock = lockfile.parse(yarnLockString);
    const path = await findPathToVersion('lit-html', '1.1.0', yarnLock.object, {}, targetPath);

    expect(path).to.equal('/node_modules/lit-element/node_modules/lit-html/lit-html.js');
  });

  it('returns null if package or version could not be found', async () => {
    const targetPath = `${__dirname}/assets/exampleNestedResolution/`;
    const yarnLockString = fs.readFileSync(`${targetPath}/yarn.lock`, 'utf-8');
    const yarnLock = lockfile.parse(yarnLockString);
    const wrongVersion = await findPathToVersion(
      'lit-html',
      '10.0.0',
      yarnLock.object,
      {}, //
      targetPath,
    );
    expect(wrongVersion).to.be.null;

    const pathNonExistingVersion = await findPathToVersion(
      'lit-html2',
      '1.0.0',
      yarnLock.object,
      {},
      targetPath,
    );
    expect(pathNonExistingVersion).to.be.null;
  });
});

describe('findPathToVersion in a workspace', () => {
  it('returns the path to a specific nested version', async () => {
    const targetPath = `${__dirname}/assets/exampleWorkspaceNestedResolution/`;
    const packageJson = JSON.parse(fs.readFileSync(`${targetPath}/package.json`, 'utf-8'));
    const yarnLockString = fs.readFileSync(`${targetPath}/yarn.lock`, 'utf-8');
    const yarnLock = lockfile.parse(yarnLockString);
    const path = await findPathToVersion(
      'lit-html', //
      '0.14.0',
      yarnLock.object,
      packageJson,
      targetPath,
    );

    expect(path).to.equal('/packages/b/node_modules/lit-html/lit-html.js');
  });
});
