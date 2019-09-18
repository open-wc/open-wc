const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { createLoaderScript } = require('../../index-html/loader-script');

const updateSnapshots = process.argv.includes('--update-snapshots');

const defaultPolyfills = [
  {
    code: undefined,
    hash: 'myhash',
    name: 'core-js',
    nomodule: true,
    sourcemap: undefined,
    test: undefined,
  },
  {
    code: undefined,
    hash: 'myhash',
    name: 'fetch',
    nomodule: false,
    sourcemap: undefined,
    test: "!('fetch' in window)",
  },
  {
    code: undefined,
    hash: 'myhash',
    name: 'intersection-observer',
    nomodule: false,
    sourcemap: undefined,
    test:
      "!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)",
  },
  {
    code: undefined,
    hash: 'myhash',
    name: 'webcomponents',
    nomodule: false,
    sourcemap: undefined,
    test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)",
  },
];

const defaultPolyfillsConfig = {
  skipHash: false,
  coreJs: false,
  regeneratorRuntime: false,
  webcomponents: false,
  intersectionObserver: false,
  fetch: false,
};

function testSnapshot({ name, entries, legacyEntries = null, polyfills = null }) {
  const snapshotPath = path.join(__dirname, 'snapshots', 'loader-script', `${name}.js`);
  const script = createLoaderScript(
    entries,
    legacyEntries,
    polyfills,
    defaultPolyfillsConfig,
    false,
  );

  if (updateSnapshots) {
    fs.writeFileSync(snapshotPath, script, 'utf-8');
  } else {
    const snapshot = fs.readFileSync(snapshotPath, 'utf-8');
    expect(script).to.equal(snapshot);
  }
}

describe('loader-script', () => {
  it('generates a loader script with one module entries', () => {
    testSnapshot({
      name: 'module-entry',
      entries: { type: 'module', files: ['app.js'] },
    });
  });

  it('generates a loader script with multiple module entries', () => {
    testSnapshot({
      name: 'module-entries',
      entries: { type: 'module', files: ['app.js', 'shared.js'] },
    });
  });

  it('generates a loader script with one system entry', () => {
    testSnapshot({
      name: 'system-entry',
      entries: { type: 'system', files: ['app.js'] },
    });
  });

  it('generates a loader script with multiple system entries', () => {
    testSnapshot({
      name: 'system-entries',
      entries: { type: 'system', files: ['app.js', 'shared.js'] },
    });
  });

  it('generates a loader script with one script entry', () => {
    testSnapshot({
      name: 'script-entry',
      entries: { type: 'script', files: ['app.js'] },
    });
  });

  it('generates a loader script with multiple script entries', () => {
    testSnapshot({
      name: 'script-entries',
      entries: { type: 'script', files: ['app.js', 'shared.js'] },
    });
  });

  it('generates a loader script with module and legacy system entry', () => {
    testSnapshot({
      name: 'module-system-entry',
      entries: { type: 'module', files: ['app.js'] },
      legacyEntries: { type: 'system', files: ['legacy/app.js'] },
    });
  });

  it('generates a loader script with script and legacy script entries', () => {
    testSnapshot({
      name: 'script-script-entries',
      entries: { type: 'script', files: ['app.js', 'shared.js'] },
      legacyEntries: { type: 'script', files: ['legacy/app.js', 'legacy/shared.js'] },
    });
  });

  it('generates a loader script with polyfills', () => {
    testSnapshot({
      name: 'polyfills',
      entries: { type: 'module', files: ['app.js'] },
      polyfills: defaultPolyfills,
    });
  });

  it('generates a loader script with legacy entries and polyfills', () => {
    testSnapshot({
      name: 'polyfills-legacy',
      entries: { type: 'module', files: ['app.js', 'shared.js'] },
      legacyEntries: { type: 'system', files: ['legacy/app.js', 'legacy/shared.js'] },
      polyfills: defaultPolyfills,
    });
  });

  it('generates a loader script with upwards file path', () => {
    testSnapshot({
      name: 'upwards-file-path',
      entries: { type: 'module', files: ['../app.js'] },
    });
  });

  it('generates a loader script with an absolute file path', () => {
    testSnapshot({
      name: 'absolute-file-path',
      entries: { type: 'module', files: ['/app.js'] },
    });
  });
});
