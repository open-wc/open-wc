// .vuepress/config.js

const sidebar = [
  ['/guide/', 'Introduction'],
  {
    title: 'General',
    collapsable: true,
    children: [
      ['/developing/', 'Getting started'],
      ['/developing/ide', 'IDE'],
      '/developing/lit-html',
      '/developing/code-examples',
      '/developing/best-practices',
      '/developing/es-dev-server',
      ['/init/', 'Generators'],
      '/developing/types',
      '/developing/routing',
    ],
  },
  {
    title: 'Application',
    collapsable: true,
    children: [
      ['/developing/', 'Getting started'],
      {
        title: 'Linting',
        collapsable: true,
        children: [
          ['/apps/linting/', 'Getting started'],
          ['/apps/linting/linting-eslint', 'Linting ESLint'],
          ['/apps/linting/linting-prettier', 'Linting Prettier'],
          ['/apps/linting/linting-types', 'Linting Types'],
        ],
      },
      {
        title: 'Building',
        collapsable: true,
        children: [
          ['/apps/building/', 'Getting started'],
          ['/apps/building/building-rollup', 'Rollup'],
          ['/apps/building/building-webpack', 'Webpack'],
        ],
      },
      {
        title: 'Testing',
        collapsable: true,
        children: [
          ['/apps/testing/', 'Getting started'],
          '/apps/testing/testing',
          '/apps/testing/testing-karma',
          '/apps/testing/testing-sinon',
          '/apps/testing/testing-karma-bs',
          '/apps/testing/testing-wallaby',
        ],
      },
      { title: 'Publishing', collapsable: true, children: [['/apps/publishing/', 'Netlify']] },
    ],
  },
  {
    title: 'Web Component',
    collapsable: true,
    children: [
      ['/developing/', 'Getting started'],
      {
        title: 'Linting',
        collapsable: true,
        children: [
          ['/web-component/linting/', 'Getting started'],
          ['/web-component/linting/linting-eslint', 'Linting ESLint'],
          ['/web-component/linting/linting-prettier', 'Linting Prettier'],
          ['/web-component/linting/linting-types', 'Linting Types'],
        ],
      },
      {
        title: 'Building',
        collapsable: true,
        children: [['/web-component/building/', 'Getting started']],
      },
      {
        title: 'Testing',
        collapsable: true,
        children: [
          ['/web-component/testing/', 'Getting started'],
          '/web-component/testing/testing',
          '/web-component/testing/testing-karma',
          '/web-component/testing/testing-sinon',
          '/web-component/testing/testing-karma-bs',
          '/web-component/testing/testing-wallaby',
        ],
      },
      { title: 'Publishing', collapsable: true, children: [['/web-component/publishing/', 'npm']] },
    ],
  },
  {
    title: 'Tools',
    collapsable: true,
    children: [
      {
        title: 'Building',
        collapsable: true,
        children: [
          ['/tools/rollup-plugin-index-html', 'Rollup Plugin Index HTML'],
          ['/tools/webpack-index-html-plugin', 'Webpack Index HTML Plugin'],
        ],
      },
      {
        title: 'Testing',
        collapsable: true,
        children: [
          ['/tools/testing-helpers', 'Testing Helpers'],
          ['/tools/semantic-dom-diff', 'Semantic Dom Diff'],
          ['/tools/karma-esm', 'Karma ESM'],
          ['/tools/testing-chai-a11y-axe', 'Testing Chai A11y Axe'],
        ],
      },
    ],
  },
];

const sidebar2 = [
  ['/', 'Home'],
  ['/guide/', 'Introduction'],
  {
    title: 'Developing',
    collapsable: true,
    children: [
      {
        title: 'Linting',
        collapsable: true,
        children: [['/developing/ide', 'Getting started'], ['/developing/code-examples', 'asd']],
      },
      ['/developing/', 'Getting started'],
      ['/developing/ide', 'IDE'],
      '/developing/lit-html',
      '/developing/code-examples',
      '/developing/best-practices',
      '/developing/es-dev-server',
      ['/init/', 'Generators'],
      '/developing/types',
      '/developing/routing',
    ],
  },
  ['/codelabs/', 'Codelabs'],
  {
    title: 'Linting',
    collapsable: true,
    children: [
      ['/linting/', 'Getting started'],
      '/linting/linting-eslint',
      '/linting/linting-prettier',
      '/linting/linting-types',
    ],
  },
  {
    title: 'Testing',
    collapsable: true,
    children: [
      ['/app/testing/', 'Getting started'],
      '/testing/testing',
      '/testing/testing-helpers',
      '/testing/testing-chai-a11y-axe',
      '/testing/testing-sinon',
      '/testing/semantic-dom-diff',
      '/testing/testing-karma',
      '/testing/karma-esm',
      '/testing/testing-karma-bs',
      '/testing/testing-wallaby',
    ],
  },
  {
    title: 'Building',
    collapsable: true,
    children: [
      ['/building/', 'Getting started'],
      '/building/building-rollup',
      '/building/rollup-plugin-index-html',
      '/building/building-webpack',
      '/building/webpack-index-html-plugin',
    ],
  },
  {
    title: 'Demoing',
    collapsable: true,
    children: [['/demoing/', 'Getting started']],
  },
  {
    title: 'Publishing',
    collapsable: true,
    children: [['/publishing/', 'Getting started']],
  },
  {
    title: 'Automating',
    collapsable: true,
    children: [['/automating/', 'Getting started']],
  },
];
module.exports = {
  title: 'open-wc',
  description: 'Open Web Component Recommendations',
  themeConfig: {
    logo: '/logo.png',
    displayAllHeaders: false,
    sidebarDepth: 2,
    sidebar: {
      '/tools/': sidebar,
      '/apps/': sidebar,
      '/web-component/': sidebar,
      '/guide/': sidebar,
      '/codelabs/': sidebar,
      '/init/': sidebar,
      '/developing/': sidebar,
      '/linting/': sidebar,
      '/building/': sidebar,
      '/demoing/': sidebar,
      '/publishing/': sidebar,
      '/automating/': sidebar,
      '/faq/': [
        ['', 'Faq'],
        {
          title: 'Deep dives',
          collapsable: true,
          children: [
            'component-libraries',
            'rerender',
            'unit-testing-custom-events',
            'unit-testing-init-error',
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
  plugins: ['@vuepress/google-analytics'],
  ga: 'UA-131782693-1',
  head: [
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
  // temporary set to develop mode as Terser seems to have a problem :/
  configureWebpack: (config, isServer) => {
    if (!isServer) {
      config.mode = 'development';
    }
  },
};
