// .vuepress/config.js
module.exports = {
  title: 'open-wc',
  description: 'Open Web Components Recommendations',
  themeConfig: {
    displayAllHeaders: false,
    sidebarDepth: 2,
    sidebar: [
      '/guide/',
      '/recommendations/ide',
      '/recommendations/linting',
      '/recommendations/testing',
      '/recommendations/testing-helpers',
      '/recommendations/testing-dom',
      '/recommendations/demos',
      '/recommendations/publishing',
      '/recommendations/automate',
      '/help/js',
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    repo: 'open-wc/open-wc',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Improve these recommendations (or add your own)',
    lastUpdated: 'Last Updated',
  },
  dest: '_site'
}
