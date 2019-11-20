import { expect } from '../index.js';
import { exportedMessage, importMetaUrl, dynamicImport } from '../demo/module-features.js';

describe('module-features', () => {
  it('handles static imports', () => {
    expect(exportedMessage).to.equal('statically imported module');
  });

  it('handles dynamic imports', async () => {
    // test if it is a promise
    expect(dynamicImport()).to.have.property('then');
  });

  it('handles import.meta.url', async () => {
    expect(importMetaUrl).to.include('/base/packages/testing/demo/module-features.js');
  });
});
