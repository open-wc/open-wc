// .vuepress/config.js
module.exports = {
  title: 'open-wc',
  description: 'Open Web Component Recommendations',
  themeConfig: {
    logo: '/logo.png',
    displayAllHeaders: false,
    sidebarDepth: 2,
    sidebar: [
      '',
      '/guide/',
      {
        title: 'IDE',
        collapsable: true,
        children: [['/guide/ide', 'Getting started']],
      },
      {
        title: 'Developing',
        collapsable: true,
        children: [['/guide/developing', 'Getting started']],
      },
      {
        title: 'Linting',
        collapsable: true,
        children: [
          ['/guide/linting', 'Getting started'],
          '/linting/linting-eslint',
          '/linting/linting-prettier',
        ],
      },
      {
        title: 'Testing',
        collapsable: true,
        children: [
          ['/guide/testing', 'Getting started'],
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
        children: [['/guide/demoing', 'Getting started']],
      },
      {
        title: 'Publishing',
        collapsable: true,
        children: [['/guide/publishing', 'Getting started']],
      },
      {
        title: 'Automating',
        collapsable: true,
        children: [['/guide/automating', 'Getting started']],
      },
    ],
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
