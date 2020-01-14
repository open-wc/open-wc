module.exports = {
  stories: ['../stories/**/*.stories.{js,mdx}'],
  rollup: () => {
    console.log('hello from rollup config decorator from main.js');
  },
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
  },
};
