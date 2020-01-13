module.exports = {
  stories: '../stories/**/*.stories.{js,mdx}',
  rollup: configs => {
    console.log('rollup configs: ', configs);
  },
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
  },
};
