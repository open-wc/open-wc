const fs = require('fs');
const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.{js,mdx}'],
  addons: [
    // order of tabs in addons panel
    'storybook-prebuilt/addon-actions/register.js',
    'storybook-prebuilt/addon-knobs/register.js',
    'storybook-prebuilt/addon-a11y/register.js',
    'storybook-prebuilt/addon-docs/register.js',
    // no tab in addons panel (e.g. load order does not matter here)
    'storybook-prebuilt/addon-backgrounds/register.js',
    'storybook-prebuilt/addon-links/register.js',
    'storybook-prebuilt/addon-viewport/register.js',
  ],
  rollup: configs => {
    for (const config of configs) {
      config.plugins.push({
        generateBundle() {
          // when deploying the demo of the storybook using site:build, we build to a directory called
          // demoing-storybook. because we don't copy custom-elements.json from the output directory,
          // it can't find ours because it's in a directory with the same name. we copy it manually here.
          this.emitFile({
            type: 'asset',
            fileName: 'demo/custom-elements.json',
            source: fs.readFileSync(path.join(__dirname, '../custom-elements.json'), 'utf-8'),
          });

          this.emitFile({
            type: 'asset',
            fileName: 'demo/assets/logo.png',
            source: fs.readFileSync(path.join(__dirname, '../assets/logo.png')),
          });
        },
      });
    }
  },
  managerPath: require.resolve('../../manager.js'),
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
  },
};
