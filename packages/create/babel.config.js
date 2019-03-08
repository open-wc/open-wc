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
        useBuiltIns: 'usage',
      },
    ],
  ],
};
