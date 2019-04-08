# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.1.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-karma@1.0.2...@open-wc/testing-karma@1.1.0) (2019-04-08)


### Features

* **semantic-dom-diff:** add support for snapshot testing ([f7a675a](https://github.com/open-wc/open-wc/commit/f7a675a))





## [1.0.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-karma@1.0.1...@open-wc/testing-karma@1.0.2) (2019-04-06)


### Bug Fixes

* **testing-karma:** resolve chrome launcher ([6e303b5](https://github.com/open-wc/open-wc/commit/6e303b5))





## [1.0.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-karma@1.0.0...@open-wc/testing-karma@1.0.1) (2019-04-05)


### Bug Fixes

* do not assume available global types of users ([cd394d9](https://github.com/open-wc/open-wc/commit/cd394d9))





# [1.0.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-karma@0.4.15...@open-wc/testing-karma@1.0.0) (2019-03-31)


### Bug Fixes

* adopt new karma setup for all packages ([1888260](https://github.com/open-wc/open-wc/commit/1888260))


### Features

* **testing-karma:** improve karma config setup ([b173380](https://github.com/open-wc/open-wc/commit/b173380))


### BREAKING CHANGES

* **testing-karma:** overall setup changed
=> if you have mostly default configs you should be able to just run `npm init @open-wc testing`
* **testing-karma:** `karma.conf.js` changes
```js
// old
const defaultSettings = require('@open-wc/testing-karma/default-settings.js');

// new
const createDefaultConfig = require('@open-wc/testing-karma/default-config.js');
```
* **testing-karma:** `karma.es5.config.js` is no longer needed
=> use `karma start --legacy` instead
* **testing-karma:** `karma.es5.bs.config.js` renamed to `karma.bs.config.js`
* **testing-karma:** `karma.bs.config.js` changes
```js
// old
const karmaEs5Config = require('./karma.es5.config.js');

// new
const createBaseConfig = require('./karma.conf.js');
```
* **testing-karma:** `package.json` scripts changed
```js
// old package.json
"scripts": {
  "test": "karma start",
  "test:watch": "karma start --auto-watch=true --single-run=false",
  "test:es5": "karma start karma.es5.config.js",
  "test:es5:watch": "karma start karma.es5.config.js --auto-watch=true --single-run=false",
  "test:es5:bs": "karma start karma.es5.bs.config.js"
},

// new
"scripts": {
  "test": "karma start --coverage",
  "test:watch": "karma start --auto-watch=true --single-run=false",
  "test:legacy": "karma start --legacy --coverage",
  "test:legacy:watch": "karma start --legacy --auto-watch=true --single-run=false",
  "test:bs": "karma start karma.bs.conf.js --legacy --coverage"
}
```





## [0.4.15](https://github.com/open-wc/open-wc/compare/@open-wc/testing-karma@0.4.14...@open-wc/testing-karma@0.4.15) (2019-03-23)

**Note:** Version bump only for package @open-wc/testing-karma





## [0.4.14](https://github.com/open-wc/open-wc/compare/@open-wc/testing-karma@0.4.13...@open-wc/testing-karma@0.4.14) (2019-03-08)


### Bug Fixes

* **testing-karma:** exclude spec files in node_modules ([c4ad1c1](https://github.com/open-wc/open-wc/commit/c4ad1c1))





## [0.4.13](https://github.com/open-wc/open-wc/compare/@open-wc/testing-karma@0.4.12...@open-wc/testing-karma@0.4.13) (2019-03-03)


### Bug Fixes

* **testing-karma:** replace deprecated import meta url loader ([e44f3ca](https://github.com/open-wc/open-wc/commit/e44f3ca))





## [0.4.12](https://github.com/open-wc/open-wc/compare/@open-wc/testing-karma@0.4.11...@open-wc/testing-karma@0.4.12) (2019-02-26)


### Bug Fixes

* **testing-karma:** add docs how to replace a specific config part ([7bcb901](https://github.com/open-wc/open-wc/commit/7bcb901))





## [0.4.11](https://github.com/open-wc/open-wc/compare/@open-wc/testing-karma@0.4.10...@open-wc/testing-karma@0.4.11) (2019-02-16)


### Bug Fixes

* update package repository fields with monorepo details ([cb1acb7](https://github.com/open-wc/open-wc/commit/cb1acb7))





## [0.4.10](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.9...@open-wc/testing-karma@0.4.10) (2019-02-14)


### Bug Fixes

* **testing-karma:** upgrade karma to 4.x ([7b8a2f2](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/7b8a2f2))





## [0.4.9](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.8...@open-wc/testing-karma@0.4.9) (2019-02-02)


### Bug Fixes

* unify npm readme header for all open-wc packages ([1bac939](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/1bac939))





## [0.4.8](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.7...@open-wc/testing-karma@0.4.8) (2019-02-02)


### Bug Fixes

* **testing-karma:** show file/line number of failing tests on terminal ([32b0b00](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/32b0b00))





## [0.4.7](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.6...@open-wc/testing-karma@0.4.7) (2019-01-26)


### Bug Fixes

* align all open-wc readme headers ([b589429](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/b589429))





## [0.4.6](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.5...@open-wc/testing-karma@0.4.6) (2019-01-20)


### Bug Fixes

* refactor generators ([1dab1f4](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/1dab1f4))





## [0.4.5](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.4...@open-wc/testing-karma@0.4.5) (2019-01-19)


### Bug Fixes

* restructure menu and improve docu ([dd37e22](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/dd37e22))





## [0.4.4](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.3...@open-wc/testing-karma@0.4.4) (2019-01-16)


### Bug Fixes

* improve documentation ([4f5472f](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/4f5472f))





## [0.4.3](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.2...@open-wc/testing-karma@0.4.3) (2019-01-09)


### Bug Fixes

* docu typos ([aafd5e4](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/aafd5e4))





## [0.4.2](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.1...@open-wc/testing-karma@0.4.2) (2018-12-20)

**Note:** Version bump only for package @open-wc/testing-karma





## [0.4.1](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.4.0...@open-wc/testing-karma@0.4.1) (2018-12-20)


### Bug Fixes

* **testing-karma:** hotfix use [@babel](https://github.com/babel)/polyfill/dist ([1f3eae8](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/1f3eae8))





# [0.4.0](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.3.0...@open-wc/testing-karma@0.4.0) (2018-12-19)


### Features

* use extendable karma configs by default ([8fd9435](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/8fd9435))





# [0.3.0](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.2.3...@open-wc/testing-karma@0.3.0) (2018-12-13)


### Bug Fixes

* apply prettier; add lint-staged ([43acfad](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/43acfad))


### Features

* **testing-karma:** use karma-webpack#^5.0.0 for proper wc support ([#89](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/issues/89)) ([10e0de8](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/10e0de8))





## [0.2.3](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.2.2...@open-wc/testing-karma@0.2.3) (2018-12-02)

**Note:** Version bump only for package @open-wc/testing-karma





## [0.2.2](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.2.1...@open-wc/testing-karma@0.2.2) (2018-12-01)

**Note:** Version bump only for package @open-wc/testing-karma





## [0.2.1](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.2.0...@open-wc/testing-karma@0.2.1) (2018-11-30)


### Bug Fixes

* move documentation to READMEs of packages ([b4a0426](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/b4a0426))





# [0.2.0](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.1.3...@open-wc/testing-karma@0.2.0) (2018-11-26)


### Features

* **testing-karma:** provide latest and es5 karma config creators ([575f53e](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/575f53e))





## [0.1.3](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.1.2...@open-wc/testing-karma@0.1.3) (2018-10-28)


### Bug Fixes

* use version ranges ([694e137](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/694e137))





## [0.1.2](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.1.1...@open-wc/testing-karma@0.1.2) (2018-10-27)


### Bug Fixes

* **deps:** update dependency karma to v3.1.1 ([29476bb](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/29476bb))
* **deps:** update dependency webpack to v4.23.1 ([9f0f8bd](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/9f0f8bd))





## [0.1.1](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/compare/@open-wc/testing-karma@0.1.0...@open-wc/testing-karma@0.1.1) (2018-10-07)


### Bug Fixes

* move karma-bs into its own package ([9a15330](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/9a15330))





# 0.1.0 (2018-10-06)


### Bug Fixes

* add minimal readme ([9e52ca2](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/9e52ca2))


### Features

* rename test to testing ([d171018](https://github.com/open-wc/open-wc/tree/master/packages/testing-karma/commit/d171018))
