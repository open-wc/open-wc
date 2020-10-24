import { expect } from '../index.js';
import { exportedMessage, importMetaUrl, dynamicImport } from '../demo/module-features.js';

describe('module-features', () => {
  it('handles static imports', () => {
    expect(exportedMessage).to.equal('statically imported module');
  });

  // TODO: find a way to test this in a non flaky way for IE11
  it.skip('handles dynamic imports', async () => {
    // test if it is a promise
    expect(dynamicImport()).to.have.property('then');
  });

  it('handles import.meta.url', async () => {
    expect(importMetaUrl).to.include(
      `${window.location.origin}/packages/testing/demo/module-features.js`,
    );
  });
});
