module.exports = ({ config, transpilePackages = ['lit-html', 'lit-element', '@open-wc'] }) => {
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
            },
          ],
        ],
        babelrc: false,
      },
    },
  });

  return config;
};
