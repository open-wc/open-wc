---
permalink: 'testing-karma/migration.html'
title: Migration
section: guides
tags:
  - guides
---

# Migration

- [Migration](#migration)
  - [From version 3.x.x to 4.0.0](#from-version-3xx-to-400)
    - [Config changes](#config-changes)

## From version 3.x.x to 4.0.0

With 4.0.0 we replaced the `karma-coverage-istanbul-reporter` package with `karma-coverage`.

### Config changes

The configuration file `karma.conf.js` will need to be updated to rename the `coverageIstanbulReporter` property to `coverageReporter`. Your new configuration file should look something like this:

```js
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    deepmerge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
      ],

      coverageReporter: {
        thresholds: {
          global: {
            statements: 50,
            lines: 50,
            branches: 50,
            functions: 50,
          },
        },
      },
    }),
  );
  return config;
};
```
