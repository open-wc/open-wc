module.exports = {
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
