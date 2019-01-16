// .vuepress/config.js
module.exports = {
  title: 'open-wc',
  description: 'Open Web Component Recommendations',
  themeConfig: {
    logo: '/logo.png',
    displayAllHeaders: false,
    sidebarDepth: 2,
    sidebar: {
      '/guide/': [
        '/',
        '',
        'ide',
        'developing',
        'linting',
        'testing',
        ['demoing', 'Demoing'],
        'publishing',
        'automating',
        'next-steps',
      ],
      '/linting/': [
        ['/guide/linting', '⇐ back to Guide'],
        '',
        'linting-eslint',
        'linting-prettier',
      ],
      '/testing/': [
        ['/guide/testing', '⇐ back to Guide'],
        '',
        'testing-helpers',
        'testing-chai-dom-equals',
        'testing-karma',
        'testing-karma-bs',
        'testing-wallaby',
      ],
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
