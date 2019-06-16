import chai from 'chai';
import { findPackageJson } from '../src/findPackageJson';

const { expect } = chai;

describe('findPackageJson', () => {
  it('returns a list of pathes to package.jsons', async () => {
    const targetPath = `${__dirname}/assets/exampleWorkspace/`;
    const wsDeps = await findPackageJson('packages/*', targetPath);
    expect(wsDeps).to.deep.equal([
      `${targetPath}packages/a/package.json`,
      `${targetPath}packages/b/package.json`,
    ]);
  });
});
