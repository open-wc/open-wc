const { expect } = require('chai');
const { parse } = require('parse5');
const path = require('path');
const { createIndexHTML } = require('../../index-html');

const input = `
<html lang="en-GB">

<head>
  <title>My app</title>
  <style>
    my-app {
      display: block;
    }
  </style>
</head>

<body>
  <h1>
    <span>
      Hello world!
    </span>
  </h1>
  <my-app></my-app>
</body>

</html>
`;
const outputDefault =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="app.js"></script></body></html>';
const outputCoreJs =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script src="app.js"></script></body></html>';
const outputMultiple =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script>!function(){function e(e){return new Promise(function(n,t){var o=document.createElement("script");o.onerror=function(){t(new Error("Error loading "+e))},o.onload=function(){n()},o.src=e,o.setAttribute("defer",!0),document.head.appendChild(o)})}var n=["app.js"],t=[];"fetch"in window||t.push(e("polyfills/fetch.95138a44bb40831d28d42e45a2bf1bc6.js")),"IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype||t.push(e("polyfills/intersection-observer.f670a123dee2998ae15ea330be2bea16.js")),"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||t.push(e("polyfills/webcomponents.88b4b5855ede008ecad6bbdd4a69e57d.js")),t.length?Promise.all(t).then(function(){n.forEach(function(n){e(n)})}):n.forEach(function(n){e(n)})}();</script></body></html>';
const outputCustom =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="polyfills/custom-b.36a50cce88edee34c249d0276be6531d.js" nomodule=""></script><script>!function(){function e(e){return new Promise(function(o,n){var t=document.createElement("script");t.onerror=function(){n(new Error("Error loading "+e))},t.onload=function(){o()},t.src=e,t.setAttribute("defer",!0),document.head.appendChild(t)})}var o=["app.js"],n=[];"foo"in window&&n.push(e("polyfills/custom-a.612310cce7c28a680112cc9eff6ef77c.js")),"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||n.push(e("polyfills/webcomponents.88b4b5855ede008ecad6bbdd4a69e57d.js")),n.length?Promise.all(n).then(function(){o.forEach(function(o){e(o)})}):o.forEach(function(o){e(o)})}();</script></body></html>';
const outputLegacy =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>!function(){function n(n){return new Promise(function(e,o){var r=document.createElement("script");r.onerror=function(){o(new Error("Error loading "+n))},r.onload=function(){e()},r.src=n,r.setAttribute("defer",!0),document.head.appendChild(r)})}var e="noModule"in HTMLScriptElement.prototype?["app.js"]:["legacy-app.js","legacy-shared.js"],o=[];o.length?Promise.all(o).then(function(){e.forEach(function(e){n(e)})}):e.forEach(function(e){n(e)})}();</script></body></html>';
const outputLegacyAndPolyfills =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script>!function(){function n(n){return new Promise(function(e,o){var t=document.createElement("script");t.onerror=function(){o(new Error("Error loading "+n))},t.onload=function(){e()},t.src=n,t.setAttribute("defer",!0),document.head.appendChild(t)})}var e="noModule"in HTMLScriptElement.prototype?["app.js"]:["legacy-app.js","legacy-shared.js"],o=[];"fetch"in window||o.push(n("polyfills/fetch.95138a44bb40831d28d42e45a2bf1bc6.js")),o.length?Promise.all(o).then(function(){e.forEach(function(e){n(e)})}):e.forEach(function(e){n(e)})}();</script></body></html>';
const outputExternal =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style><link rel="preload" href="app.js" as="script"></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script src="polyfills/core-js.79b2367fd020fda0c519294df7db91bf.js" nomodule=""></script><script src="loader.567e5814f13becc7c57cf674b50fc39d.js"></script></body></html>';

describe('generate-index-html', () => {
  it('generates a index.html based on default configuration', () => {
    const config = {
      indexHTML: input,
      entries: ['app.js'],
    };

    const ast = parse(input);
    const result = createIndexHTML(ast, config);
    expect(result.indexHTML).to.equal(outputDefault);
  });

  it('generates a index.html with only core-js polyfills', () => {
    const config = {
      indexHTML: input,
      entries: ['app.js'],
      polyfills: {
        coreJs: true,
      },
    };

    const ast = parse(input);
    const result = createIndexHTML(ast, config);
    expect(result.indexHTML).to.equal(outputCoreJs);
  });

  it('generates a index.html with multiple polyfills', () => {
    const config = {
      indexHTML: input,
      entries: ['app.js'],
      polyfills: {
        coreJs: true,
        fetch: true,
        webcomponents: true,
        intersectionObserver: true,
      },
    };

    const ast = parse(input);
    const result = createIndexHTML(ast, config);
    expect(result.indexHTML).to.equal(outputMultiple);
  });

  it('generates a index.html with custom polyfills', () => {
    const config = {
      indexHTML: input,
      entries: ['app.js'],
      polyfills: {
        webcomponents: true,
        customPolyfills: [
          {
            name: 'custom-a',
            test: "'foo' in window",
            path: path.resolve(__dirname, '../custom-polyfills/polyfill-a.js'),
          },
          {
            name: 'custom-b',
            nomodule: true,
            path: path.resolve(__dirname, '../custom-polyfills/polyfill-b.js'),
          },
        ],
      },
    };

    const ast = parse(input);
    const result = createIndexHTML(ast, config);
    expect(result.indexHTML).to.equal(outputCustom);
  });

  it('generates a index.html with a legacy entry', () => {
    const config = {
      indexHTML: input,
      entries: ['app.js'],
      legacyEntries: ['legacy-app.js', 'legacy-shared.js'],
    };

    const ast = parse(input);
    const result = createIndexHTML(ast, config);
    expect(result.indexHTML).to.equal(outputLegacy);
  });

  it('generates a index.html with a legacy entry and polyfills', () => {
    const config = {
      indexHTML: input,
      entries: ['app.js'],
      legacyEntries: ['legacy-app.js', 'legacy-shared.js'],
      polyfills: {
        coreJs: true,
        fetch: true,
      },
    };

    const ast = parse(input);
    const result = createIndexHTML(ast, config);
    expect(result.indexHTML).to.equal(outputLegacyAndPolyfills);
  });

  it('generates a index.html with an external polyfills loader', () => {
    const config = {
      indexHTML: input,
      entries: ['app.js'],
      legacyEntries: ['legacy-app.js', 'legacy-shared.js'],
      loader: 'external',
      polyfills: {
        coreJs: true,
        fetch: true,
      },
    };

    const ast = parse(input);
    const result = createIndexHTML(ast, config);
    expect(result.indexHTML).to.equal(outputExternal);
  });
});
