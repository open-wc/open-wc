module.exports = ({ config, transpilePackages = ['lit-html', 'lit-element', '@open-wc'] }) => {
  // eslint-disable-next-line no-param-reassign
  config.resolve.symlinks = false;

  config.module.rules.push({
    test: [/\.stories\.js$/, /index\.js$/],
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre',
  });

  // this is a separate config for only those packages
  // the main storybook will use the .babelrc which is needed so storybook itself works in IE
  config.module.rules.push({
    test: new RegExp(`node_modules(\\/|\\\\)(${transpilePackages.join('|')})(.*)\\.js$`),
    use: {
      loader: 'babel-loader',
      options: {
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-proposal-object-rest-spread',
        ],
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'entry',
              corejs: '2',
            },
          ],
        ],
        babelrc: false,
      },
    },
  });

  return config;
};
