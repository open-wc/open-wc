# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.3](https://github.com/open-wc/open-wc/compare/@open-wc/karma-esm@1.0.2...@open-wc/karma-esm@1.0.3) (2019-05-25)


### Bug Fixes

* **karma-esm:** correctly resolve symlinks ([01445cf](https://github.com/open-wc/open-wc/commit/01445cf))





## [1.0.2](https://github.com/open-wc/open-wc/compare/@open-wc/karma-esm@1.0.1...@open-wc/karma-esm@1.0.2) (2019-05-19)

**Note:** Version bump only for package @open-wc/karma-esm





## [1.0.1](https://github.com/open-wc/open-wc/compare/@open-wc/karma-esm@1.0.0...@open-wc/karma-esm@1.0.1) (2019-05-06)

**Note:** Version bump only for package @open-wc/karma-esm





# 1.0.0 (2019-05-06)


### Features

* **testing-karma:** use native es modules in modern browsers ([187d155](https://github.com/open-wc/open-wc/commit/187d155))


### BREAKING CHANGES

* **testing-karma:** You need to specify type: 'module' for you files
```js
// old karma.conf.js
files: [
  config.grep ? config.grep : 'test/**/*.test.js',
]

// new karma.conf.js
files: [
  { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
]
