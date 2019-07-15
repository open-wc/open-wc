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
      code: undefined,
      sourcemap: undefined,
    }));

    expect(polyfillsWithoutCode).to.eql([
      {
        code: undefined,
        hash: '7ca91f6b0231c95b468b2436196952c1',
        name: 'core-js',
        module: false,
        nomodule: true,
        sourcemap: undefined,
        test: undefined,
      },
      {
        code: undefined,
        hash: '25d91ed49dc86803b0aa17858b018737',
        name: 'fetch',
        module: false,
        nomodule: false,
        sourcemap: undefined,
        test: "!('fetch' in window)",
      },
      {
        code: undefined,
        hash: 'f670a123dee2998ae15ea330be2bea16',
        name: 'intersection-observer',
        module: false,
        nomodule: false,
        sourcemap: undefined,
        test:
          "!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)",
      },
      {
        code: undefined,
        hash: '88b4b5855ede008ecad6bbdd4a69e57d',
        name: 'webcomponents',
        module: false,
        nomodule: false,
        sourcemap: undefined,
        test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)",
      },
      {
        code: undefined,
        hash: '551c76d38426de62c33d8c61995c1d0f',
        name: 'custom-elements-es5-adapter',
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
      code: undefined,
      sourcemap: undefined,
    }));

    expect(polyfillsWithoutCode).to.eql([
      {
        code: undefined,
        hash: '99ae432d7df7b7916392294c3f66e08c',
        name: 'systemjs',
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
      code: undefined,
      sourcemap: undefined,
    }));

    expect(polyfillsWithoutCode).to.eql([
      {
        code: undefined,
        hash: '99ae432d7df7b7916392294c3f66e08c',
        name: 'systemjs',
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
      code: undefined,
      sourcemap: undefined,
    }));

    expect(polyfillsWithoutCode).to.eql([
      {
        code: undefined,
        hash: '612310cce7c28a680112cc9eff6ef77c',
        name: 'polyfill-a',
        module: false,
        nomodule: false,
        sourcemap: undefined,
        test: "'foo' in window",
      },
      {
        code: undefined,
        hash: '053c9d2c677a96db83e06c1b41ce879c',
        name: 'polyfill-b',
        module: false,
        nomodule: true,
        sourcemap: undefined,
        test: undefined,
      },
      {
        code: undefined,
        hash: '7ca91f6b0231c95b468b2436196952c1',
        name: 'core-js',
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
