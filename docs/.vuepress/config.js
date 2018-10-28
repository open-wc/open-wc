// .vuepress/config.js
module.exports = {
  title: 'open-wc',
  description: 'Open Web Components Recommedations',
  themeConfig: {
    displayAllHeaders: false,
    sidebarDepth: 2,
    sidebar: [
      '/guide/',
      '/recommodations/ide',
      '/recommodations/linting',
      '/recommodations/testing',
      '/recommodations/demos',
      '/recommodations/publishing',
      '/recommodations/automate',
      '/help/js',
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    repo: 'open-wc/open-wc',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Improve these recommodations (or add your own)',
    lastUpdated: 'Last Updated',
  },
  dest: '_site'
}
