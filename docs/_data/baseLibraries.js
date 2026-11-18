/* eslint-disable import-x/no-extraneous-dependencies */
const cache = require('@11ty/eleventy-cache-assets');

const baseLibraries = [
  {
    name: 'lit',
    package: 'lit',
    description: 'Simple. Fast. Web Components.',
    url: 'https://lit.dev/',
  },
  {
    name: 'FAST',
    package: '@microsoft/fast-element',
    description: 'The adaptive interface system for modern web experiences',
    url: 'https://www.fast.design/',
  },
  {
    package: 'atomico',
    description:
      'Atomico a micro-library for creating webcomponents using only functions, hooks and virtual-dom.',
  },
  {
    package: 'haunted',
    description: "React's Hooks API but for standard web components and lit-html or hyperHTML",
  },
  {
    package: 'hybrids',
    description: 'The simplest way to create web components with plain objects and pure functions!',
  },
  {
    package: 'hyperhtml-element',
    description: 'An extensible class to define hyperHTML based Custom Elements',
  },
  {
    name: 'Joist',
    package: '@joist/component',
    description:
      'A small (~2kb) library to help with the creation of web components and web component based applications',
  },
  {
    name: 'Lightning Web Components',
    package: 'lwc',
    description: 'A Blazing Fast, Enterprise-Grade Web Components Foundation',
  },
  {
    name: 'preact-custom-element',
    package: 'preact-custom-element',
    description: 'Generate/register a custom element from a preact component',
  },
  {
    package: '@skatejs/element',
    description:
      'Skate is a library built on top of the W3C web component specs that enables you to write functional and performant web components with a very small footprint.',
    url: 'https://skatejs.netlify.com/',
  },
  {
    package: 'slimjs',
    description:
      'a lightweight web component authoring library that provides extended capabilities for components (such as data binding) using es6 native class inheritance',
  },
  {
    package: 'solid-js',
    description: 'The Deceptively Simple User Interface Library',
  },
  {
    name: 'Stencil',
    package: '@stencil/core',
    description: 'Stencil is a toolchain for building reusable, scalable Design Systems.',
    url: 'https://stenciljs.com/',
  },
  {
    name: 'CanJS',
    package: 'can',
    description: 'Build CRUD apps in fewer lines of code',
    url: 'https://canjs.com/',
  },
  {
    name: 'ElemX',
    package: 'elemx',
    description:
      'Library for connecting MobX to native Web Components with a Vue-like template binding syntax',
    url: 'https://github.com/agquick/elemx.js',
  },
  {
    name: 'Omi',
    package: 'omi',
    description: 'Front End Cross-Frameworks Framework',
    url: 'https://tencent.github.io/omi/',
  },
  {
    name: 'ReadyMade',
    package: '@readymade/core',
    description: 'JavaScript microlibrary for developing Web Components with Decorators',
    url: 'https://github.com/readymade-ui/readymade',
  },
  {
    name: 'µce-template',
    package: 'uce-template',
    description: 'A tiny toolless library with tools included',
    url: 'https://github.com/WebReflection/uce-template',
  },
  {
    name: 'Gallop',
    package: '@gallop/gallop',
    description: 'Use full power of web components',
    url: 'https://github.com/tarnishablec/gallop',
  },
  {
    package: 'heresy',
    description:
      "Don't simulate the DOM. Be the DOM. React-like Custom Elements via the V1 API built-in extends.",
    url: 'https://github.com/WebReflection/heresy',
  },
  {
    package: 'litedom',
    description:
      'A blazing fast view library to create Web Components and use Javascript Template Literals in HTML',
    url: 'https://litedom.js.org/',
  },
  {
    package: 'swiss',
    description: 'Functional custom elements.',
    url: 'https://github.com/luwes/swiss',
  },
  {
    name: 'µce',
    package: 'uce',
    description: 'µhtml based Custom Elements.',
    url: 'https://github.com/WebReflection/uce',
  },
  {
    name: 'DataFormsJS',
    package: 'dataformsjs',
    description:
      'Set of Web Components that can be used to build Single Page Apps (SPA), Display JSON data from API’s and Web Services, and bind data to different elements on screen. All Web Components are plain JavaScript and require no build process.',
    url: 'https://github.com/dataformsjs/dataformsjs',
  },
  {
    name: 'Symbiote.js',
    package: '@symbiotejs/symbiote',
    description: 'Library to create embedded components and data channels between them.',
    url: 'https://symbiotejs.org/',
  },
  {
    name: 'FicusJS',
    package: 'ficusjs',
    description:
      'FicusJS is a set of lightweight functions for developing applications using web components.',
    url: 'https://www.ficusjs.org/',
  },
  {
    name: 'bay.js',
    package: '@dunks1980/bay.js',
    description:
      "An easy to use, lightweight library for web-components that doesn't need a build step but can be included in a build step if you want to. It's a great way to create reusable components for your projects. It's available as a NPM package or module and doesn't use any dependencies and is around 4.5kb minified + gzipped. It also doesn't use eval or new Function so can be used in strict CSP polices without a build step. For documentation and demos go to Bayjs.org.",
    url: 'https://bayjs.org/examples',
  },
];

module.exports = async function getBaseLibraries() {
  const result = await Promise.all(
    baseLibraries.map(async lib => {
      const pkg = encodeURIComponent(lib.package);
      const { downloads } = await cache(`https://api.npmjs.org/downloads/point/last-week/${pkg}`, {
        duration: '1d',
        type: 'json',
      });

      return {
        ...lib,
        downloads,
        downloadsFormatted: new Intl.NumberFormat('de-DE').format(downloads),
        name: lib.name || lib.package,
        url: lib.url || `https://www.npmjs.com/package/${pkg}`,
      };
    }),
  );

  return result.sort((a, b) => b.downloads - a.downloads);
};
