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
    children: [['/developing/', 'Getting started']],
  },
  {
    title: 'Linting',
    collapsable: true,
    children: [
      ['/linting/', 'Getting started'],
      '/linting/linting-eslint',
      '/linting/linting-prettier',
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
      '/demoing/': sidebar,
      '/publishing/': sidebar,
      '/automating/': sidebar,
      '/setup/': [['/guide/', '⇐ back to Guide'], '', 'generator'],
      '/faq/': ['', 'rerender'],
      '/about/': ['', 'contact'],
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'FAQ', link: '/faq/' },
      { text: 'Contact', link: '/about/contact' },
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
};
