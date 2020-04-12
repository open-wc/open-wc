const fs = require('fs');
const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.{js,mdx,md}'],
  addons: [],
  rollup: config => {
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
  },
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
  },
};
