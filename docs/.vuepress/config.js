// .vuepress/config.js

const sidebar = [
  ['/', 'Home'],
  ['/guide/', 'Introduction'],
  {
    title: 'IDE',
    collapsable: true,
    children: [['/ide/', 'Getting started']],
  },
  {
    title: 'Developing',
    collapsable: true,
    children: [
      ['/developing/', 'Getting started'],
      '/developing/owc-dev-server',
      ['/developing/create', 'Generators'],
      '/developing/types',
    ],
  },
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
      ['/testing/', 'Getting started'],
      '/testing/testing-helpers',
      '/testing/testing-chai-dom-equals',
      '/testing/testing-karma',
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
      '/building/building-webpack',
      '/building/polyfills-loader',
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
      '/guide/': sidebar,
      '/ide/': sidebar,
      '/developing/': sidebar,
      '/linting/': sidebar,
      '/testing/': sidebar,
      '/building/': sidebar,
      '/demoing/': sidebar,
      '/publishing/': sidebar,
      '/automating/': sidebar,
      '/faq/': [
        ['', 'Faq'],
        {
          title: 'Deep dives',
          collapsable: true,
          children: ['rerender', 'unit-testing-custom-events'],
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
