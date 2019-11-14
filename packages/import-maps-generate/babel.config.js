module.exports = {
  plugins: ['babel-plugin-transform-dynamic-import'],
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
