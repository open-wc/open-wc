module.exports = {
  stories: ['../stories/*.stories.{js,md}'],
  // this would disable the ids of headlines - you can also use it to add your own unified/remark plugins
  // setupMdjsPlugins: plugins => plugins.filter(plugin => plugin.name !== 'mdSlug'),
  esDevServer: {
    open: true,
    watch: true,
    nodeResolve: true,
  },
};
