const path = require('path');
const { expect } = require('chai');
const { getPolyfills } = require('../../index-html/polyfills');

describe('polyfills', () => {
  it('returns the correct polyfills', () => {
    const config = {
      polyfills: {
        coreJs: true,
        webcomponents: true,
        fetch: true,
        intersectionObserver: true,
      },
      minify: true,
    };

    // @ts-ignore
    const polyfills = getPolyfills(config);
    const polyfillsWithoutCode = polyfills.map(p => ({
      ...p,
      hash: undefined,
      code: undefined,
      sourcemap: undefined,
    }));

    expect(polyfillsWithoutCode).to.eql([
      {
        code: undefined,
        name: 'core-js',
        hash: undefined,
        module: false,
        nomodule: true,
        sourcemap: undefined,
        test: undefined,
      },
      {
        code: undefined,
        name: 'fetch',
        hash: undefined,
        module: false,
        nomodule: false,
        sourcemap: undefined,
        test: "!('fetch' in window)",
      },
      {
        code: undefined,
        name: 'intersection-observer',
        hash: undefined,
        module: false,
        nomodule: false,
        sourcemap: undefined,
        test:
          "!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)",
      },
      {
        code: undefined,
        name: 'webcomponents',
        hash: undefined,
        module: false,
        nomodule: false,
        sourcemap: undefined,
        test:
          "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || (window.ShadyDOM && window.ShadyDOM.force)",
      },
      {
        code: undefined,
        name: 'custom-elements-es5-adapter',
        hash: undefined,
        module: false,
        nomodule: false,
        sourcemap: undefined,
        test: "!('noModule' in HTMLScriptElement.prototype) && 'getRootNode' in Element.prototype",
      },
    ]);

    polyfills.forEach(polyfill => {
      expect(polyfill.code).to.exist;
      expect(polyfill.sourcemap).to.exist;
    });
  });

  it('polyfills system with nomodule false if entry is systemjs', () => {
    const config = {
      polyfills: {
        systemJs: true,
      },
      entries: {
        type: 'system',
      },
    };

    // @ts-ignore
    const polyfills = getPolyfills(config);
    const polyfillsWithoutCode = polyfills.map(p => ({
      ...p,
      hash: undefined,
      code: undefined,
      sourcemap: undefined,
    }));

    expect(polyfillsWithoutCode).to.eql([
      {
        code: undefined,
        name: 'systemjs',
        hash: undefined,
        module: false,
        nomodule: false,
        test: undefined,
        sourcemap: undefined,
      },
    ]);
  });

  it('polyfills system with nomodule true', () => {
    const config = {
      polyfills: {
        systemJs: true,
      },
      entries: {
        type: 'script',
      },
    };

    // @ts-ignore
    const polyfills = getPolyfills(config);
    const polyfillsWithoutCode = polyfills.map(p => ({
      ...p,
      hash: undefined,
      code: undefined,
      sourcemap: undefined,
    }));

    expect(polyfillsWithoutCode).to.eql([
      {
        code: undefined,
        name: 'systemjs',
        hash: undefined,
        module: false,
        nomodule: true,
        test: undefined,
        sourcemap: undefined,
      },
    ]);
  });

  it('can load custom polyfills', () => {
    const customPolyfills = [
      {
        name: 'polyfill-a',
        test: "'foo' in window",
        path: path.resolve(__dirname, '../custom-polyfills/polyfill-a.js'),
      },
      {
        name: 'polyfill-b',
        nomodule: true,
        path: path.resolve(__dirname, '../custom-polyfills/polyfill-b.js'),
        sourcemapPath: path.resolve(__dirname, '../custom-polyfills/polyfill-b.js.map'),
      },
    ];
    const config = {
      polyfills: {
        coreJs: true,
        webcomponents: false,
        fetch: false,
        intersectionObserver: false,
        customPolyfills,
      },
      minify: true,
    };

    // @ts-ignore
    const polyfills = getPolyfills(config);
    const polyfillsWithoutCode = polyfills.map(p => ({
      ...p,
      hash: undefined,
      code: undefined,
      sourcemap: undefined,
    }));

    expect(polyfillsWithoutCode).to.eql([
      {
        code: undefined,
        name: 'polyfill-a',
        hash: undefined,
        module: false,
        nomodule: false,
        sourcemap: undefined,
        test: "'foo' in window",
      },
      {
        code: undefined,
        name: 'polyfill-b',
        hash: undefined,
        module: false,
        nomodule: true,
        sourcemap: undefined,
        test: undefined,
      },
      {
        code: undefined,
        name: 'core-js',
        hash: undefined,
        module: false,
        nomodule: true,
        sourcemap: undefined,
        test: undefined,
      },
    ]);

    polyfills.forEach(polyfill => {
      expect(polyfill.code).to.exist;
      expect(polyfill.sourcemap).to.exist;
    });
  });
});
