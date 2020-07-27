// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
const { createDefaultConfig } = require('../testing-karma');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      basePath: '../../../',

      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        {
          pattern: config.grep ? config.grep : 'packages/testing-karma/demo/test/**/*.test.js',
          type: 'module',
        },
      ],

      // you can overwrite/extend the config further
    }),
  );
  return config;
};
