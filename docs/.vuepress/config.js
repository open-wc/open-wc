// .vuepress/config.js

const sidebar = [
  ['/guide/', 'Introduction'],
  {
    title: 'Guides & Docs',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      '/developing/best-practices',
      ['/codelabs/', 'Codelabs'],
      '/developing/code-examples',
      '/developing/lit-html',
      '/developing/types',
      '/developing/routing',
      ['/developing/ide', 'IDE'],
      '/guide/component-libraries',
    ],
  },
  {
    title: 'Configs & Recommendations',
    collapsable: true,
    children: [
      {
        title: 'Linting',
        collapsable: false,
        sidebarDepth: 0,
        children: [
          ['/linting/', 'Getting started'],
          '/linting/linting-eslint',
          '/linting/linting-types',
        ],
      },
      {
        title: 'Developing',
        collapsable: false,
        sidebarDepth: 0,
        children: ['/developing/'],
      },

      {
        title: 'Testing',
        collapsable: false,
        sidebarDepth: 0,
        children: [
          ['/testing/', 'Getting started'],
          '/testing/testing',
          '/testing/testing-karma',
          '/testing/testing-karma-bs',
          '/testing/testing-wallaby',
        ],
      },
      {
        title: 'Building apps for production',
        collapsable: false,
        sidebarDepth: 0,
        children: [['/building/', 'Getting started'], '/building/building-rollup'],
      },
      {
        title: 'Deploying apps',
        collapsable: false,
        sidebarDepth: 0,
        children: [['/deploying/', 'Getting started']],
      },
      {
        title: 'Demoing',
        collapsable: false,
        sidebarDepth: 0,
        children: [['/demoing/', 'Getting started']],
      },
    ],
  },
  {
    title: 'Tools & Libraries',
    collapsable: true,
    children: [
      {
        title: 'Developing',
        collapsable: false,
        sidebarDepth: 0,
        children: [
          '/developing/es-dev-server',
          ['/init/', 'Generators'],
          '/developing/lit-helpers',
          '/guide/dedupe-mixin',
          ['/scoped-elements/', 'Scoped Elements'],
        ],
      },
      {
        title: 'Testing',
        collapsable: false,
        sidebarDepth: 0,
        children: [
          '/testing/testing-helpers',
          '/testing/testing-chai-a11y-axe',
          '/testing/testing-sinon',
          '/testing/semantic-dom-diff',
          '/testing/karma-esm',
        ],
      },
      {
        title: 'Building',
        collapsable: false,
        sidebarDepth: 0,
        children: [
          '/building/rollup-plugin-html',
          '/building/rollup-plugin-polyfills-loader',
          '/building/polyfills-loader',
        ],
      },
      {
        title: 'Demoing',
        collapsable: false,
        sidebarDepth: 0,
        children: ['/demoing/storybook-addon-markdown-docs'],
      },
    ],
  },
  {
    title: 'Experiments',
    collapsable: true,
    children: ['/mdjs/'],
  },
];

module.exports = {
  title: 'open-wc',
  description: 'Open Web Component Recommendations',
  themeConfig: {
    logo: '/logo.png',
    displayAllHeaders: false,
    sidebarDepth: 0,
    sidebar: {
      '/guide/': sidebar,
      '/codelabs/': sidebar,
      '/init/': sidebar,
      '/developing/': sidebar,
      '/linting/': sidebar,
      '/testing/': sidebar,
      '/building/': sidebar,
      '/demoing/': sidebar,
      '/deploying/': sidebar,
      '/automating/': sidebar,
      '/scoped-elements/': sidebar,
      '/mdjs/': sidebar,
      '/faq/': [
        ['', 'Faq'],
        {
          title: 'Deep dives',
          collapsable: false,
          children: [
            'events',
            'rerender',
            'unit-testing-custom-events',
            'unit-testing-init-error',
            'lit-element-lifecycle',
          ],
        },
      ],
      '/about/': [['/about/', 'About'], '/about/contact', '/about/rationales', '/about/blog'],
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'FAQ', link: '/faq/' },
      { text: 'About', link: '/about/' },
    ],
    repo: 'open-wc/open-wc',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit Page',
    lastUpdated: 'Last Updated',
  },
  dest: '_site',
  plugins: [
    '@vuepress/google-analytics',
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: false,
        generateSWConfig: {
          swDest: '_site/service-worker.js',
          skipWaiting: true,
          clientsClaim: true,
          globDirectory: '_site',
          globPatterns: ['**/*.{html,js,css,png,gif}'],
        },
      },
    ],
  ],
  ga: 'UA-131782693-1',
  head: [
    [
      'script',
      {},
      `
      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange',
        function() {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        }
      );
    `,
    ],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    [
      'meta',
      {
        property: 'og:image',
        content:
          'https://raw.githubusercontent.com/open-wc/open-wc/master/docs/.vuepress/public/logo.png',
      },
    ],
    ['meta', { property: 'og:site_name', content: 'Open Web Components' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Open Web Components provides a set of defaults, recommendations and tools to help facilitate your web component project. Our recommendations include: developing, linting, testing, building, tooling, demoing, publishing and automating.',
      },
    ],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'Open Web Components' }],
  ],
};
