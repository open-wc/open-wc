module.exports = {
  plugins: ['babel-plugin-transform-dynamic-import'],
  ignore: ['./src/generators/*/templates/**/*'],
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '10',
        },
        corejs: 2,
        useBuiltIns: 'usage',
      },
    ],
  ],
};
