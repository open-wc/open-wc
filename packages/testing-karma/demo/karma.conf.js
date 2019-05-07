// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
const defaultConfig = require('../default-config.js');

module.exports = config => {
  config.set(
    merge(defaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
      ],

      esm: {
        baseDir: './demo/',
        moduleResolveRoot: '../../',
      },

      // you can overwrite/extend the config further
    }),
  );
  return config;
};
