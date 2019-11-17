import { expect } from '../index.js';
import { exportedMessage, importMetaUrl, dynamicImport } from '../demo/module-features.js';

describe('module-features', () => {
  it('handles static imports', () => {
    expect(exportedMessage).to.equal('statically imported module');
  });

  it('handles dynamic imports', async () => {
    expect((await dynamicImport()).default).to.equal('dynamically imported module');
  });

  it('handles import.meta.url', async () => {
    expect(importMetaUrl).to.include('/base/packages/testing/demo/module-features.js');
  });
});
