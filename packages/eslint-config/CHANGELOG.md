# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@2.1.0...@open-wc/eslint-config@3.0.0) (2020-08-16)


### Features

* **eslint-config:** upgrade eslint to 7.x ([7802511](https://github.com/open-wc/open-wc/commit/78025116dd9161ecc975c671f5c0022235d5b285))


### BREAKING CHANGES

* **eslint-config:** for a guide to migrate your code to eslint 7.x, as well as a list of breaking changes, please refer to:
- https://eslint.org/docs/user-guide/migrating-to-6.0.0
- https://eslint.org/docs/user-guide/migrating-to-7.0.0

Additionally, this change also removes the usage of `babel-eslint`. For most projects, this should work transparently. However, if your code specifically references one of its rules, you can:
- add `@babel/eslint-parser` to your devDependencies
or
- remove the references, as some of the rules have been merged into eslint





# [2.1.0](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@2.0.6...@open-wc/eslint-config@2.1.0) (2020-08-05)


### Features

* **eslint-config:** add plugins as peer dependencies ([#1740](https://github.com/open-wc/open-wc/issues/1740)) ([3760f77](https://github.com/open-wc/open-wc/commit/3760f776ea3d5036e55c926f5d7888e057a3c702))





## [2.0.6](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@2.0.5...@open-wc/eslint-config@2.0.6) (2020-05-05)


### Bug Fixes

* **eslint-config:** fixes open-wc/open-wc[#1602](https://github.com/open-wc/open-wc/issues/1602) ([6838fc7](https://github.com/open-wc/open-wc/commit/6838fc71c8c1dcde8c5102ab848e313b3d149659))





## [2.0.5](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@2.0.4...@open-wc/eslint-config@2.0.5) (2020-04-26)

**Note:** Version bump only for package @open-wc/eslint-config





## [2.0.4](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@2.0.3...@open-wc/eslint-config@2.0.4) (2020-03-06)


### Bug Fixes

* **eslint-config:** add support for optional chaining ([#1399](https://github.com/open-wc/open-wc/issues/1399)) ([79b0683](https://github.com/open-wc/open-wc/commit/79b0683034dc31f9101a403fa75d47ba4037f9c4))





## [2.0.3](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@2.0.2...@open-wc/eslint-config@2.0.3) (2020-02-09)

**Note:** Version bump only for package @open-wc/eslint-config





## [2.0.2](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@2.0.1...@open-wc/eslint-config@2.0.2) (2019-12-16)


### Bug Fixes

* update linting docu to updates in package.json ([e58015c](https://github.com/open-wc/open-wc/commit/e58015cddd6f72650d99059900f3142d2a4b0dc9))
* **eslint-config:** remove no-property-change-update ([f20e924](https://github.com/open-wc/open-wc/commit/f20e924366d5122f648f2a42b0a7d76cbf8d4797))





## [2.0.1](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@2.0.0...@open-wc/eslint-config@2.0.1) (2019-12-08)

**Note:** Version bump only for package @open-wc/eslint-config





# [2.0.0](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@1.3.0...@open-wc/eslint-config@2.0.0) (2019-12-02)


### Features

* **eslint-config:** add eslint-plugin-lit ([#1024](https://github.com/open-wc/open-wc/issues/1024)) ([b2f4f7e](https://github.com/open-wc/open-wc/commit/b2f4f7e6cd5852cc1223919de9c8c0feaf7e0459))


### BREAKING CHANGES

* **eslint-config:** lit-html templates are now linted as well





# [1.3.0](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@1.2.0...@open-wc/eslint-config@1.3.0) (2019-11-03)


### Features

* **eslint-config:** allow for-of loops in eslint ([f6dc2c5](https://github.com/open-wc/open-wc/commit/f6dc2c5))





# [1.2.0](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@1.1.2...@open-wc/eslint-config@1.2.0) (2019-10-28)


### Features

* **eslint-config:** use eslint-plugin-no-only-tests ([#914](https://github.com/open-wc/open-wc/issues/914)) ([41b928d](https://github.com/open-wc/open-wc/commit/41b928d))





## [1.1.2](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@1.1.1...@open-wc/eslint-config@1.1.2) (2019-10-23)


### Bug Fixes

* add package keywords ([#859](https://github.com/open-wc/open-wc/issues/859)) ([cd78405](https://github.com/open-wc/open-wc/commit/cd78405))





## [1.1.1](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@1.1.0...@open-wc/eslint-config@1.1.1) (2019-08-15)


### Bug Fixes

* **eslint-config:** set arrow-parens rule ([af8f4c7](https://github.com/open-wc/open-wc/commit/af8f4c7))





# [1.1.0](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@1.0.0...@open-wc/eslint-config@1.1.0) (2019-08-14)


### Features

* **eslint-config:** resolve extended linting configurations ([13ee4ba](https://github.com/open-wc/open-wc/commit/13ee4ba))
* **eslint-config:** update dependencies ([52909e8](https://github.com/open-wc/open-wc/commit/52909e8))





# [1.0.0](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@0.4.5...@open-wc/eslint-config@1.0.0) (2019-07-08)


### Bug Fixes

* use file extensions for imports to support import maps ([c711b13](https://github.com/open-wc/open-wc/commit/c711b13))


### Features

* **eslint-config:** add import extensions linting rule ([cd407e7](https://github.com/open-wc/open-wc/commit/cd407e7))


### BREAKING CHANGES

* **eslint-config:** imports now require a file extension
every import that is not a "pure" bare import requires a file extension
```js
// before
import '../my-el';
import '@open-wc/testing/index-no-side-effects';
import '@open-wc/testing';
// after
import '../my-el.js';
import '@open-wc/testing/index-no-side-effects.js';
import '@open-wc/testing';
```





## [0.4.5](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@0.4.4...@open-wc/eslint-config@0.4.5) (2019-04-28)


### Bug Fixes

* **eslint-config:** do not force use of this in life cycle methods ([#409](https://github.com/open-wc/open-wc/issues/409)) ([a407aba](https://github.com/open-wc/open-wc/commit/a407aba))





## [0.4.4](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@0.4.3...@open-wc/eslint-config@0.4.4) (2019-04-28)


### Bug Fixes

* **eslint-config:** loosen up rules for test and stories files ([#408](https://github.com/open-wc/open-wc/issues/408)) ([3fd251e](https://github.com/open-wc/open-wc/commit/3fd251e))





## [0.4.3](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@0.4.2...@open-wc/eslint-config@0.4.3) (2019-04-14)


### Bug Fixes

* update generator usage ([5d284d4](https://github.com/open-wc/open-wc/commit/5d284d4))





## [0.4.2](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@0.4.1...@open-wc/eslint-config@0.4.2) (2019-03-24)


### Bug Fixes

* adjust generator-open-wc links to create ([cc014b1](https://github.com/open-wc/open-wc/commit/cc014b1))





## [0.4.1](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@0.4.0...@open-wc/eslint-config@0.4.1) (2019-03-08)

**Note:** Version bump only for package @open-wc/eslint-config





# [0.4.0](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@0.3.12...@open-wc/eslint-config@0.4.0) (2019-03-01)


### Features

* **eslint-config:** add eslint-plugin-wc ([be637a5](https://github.com/open-wc/open-wc/commit/be637a5))





## [0.3.12](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@0.3.11...@open-wc/eslint-config@0.3.12) (2019-02-24)


### Bug Fixes

* **eslint-config:** allow usage of devDeps in *.config files ([ad52be0](https://github.com/open-wc/open-wc/commit/ad52be0))





## [0.3.11](https://github.com/open-wc/open-wc/compare/@open-wc/eslint-config@0.3.10...@open-wc/eslint-config@0.3.11) (2019-02-16)


### Bug Fixes

* update package repository fields with monorepo details ([cb1acb7](https://github.com/open-wc/open-wc/commit/cb1acb7))





## [0.3.10](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.9...@open-wc/eslint-config@0.3.10) (2019-02-02)


### Bug Fixes

* unify npm readme header for all open-wc packages ([1bac939](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/1bac939))





## [0.3.9](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.8...@open-wc/eslint-config@0.3.9) (2019-01-31)


### Bug Fixes

* **eslint-config:** allow usage of devDeps in nested test/stories folders ([e8663f3](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/e8663f3))





## [0.3.8](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.7...@open-wc/eslint-config@0.3.8) (2019-01-26)


### Bug Fixes

* align all open-wc readme headers ([b589429](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/b589429))





## [0.3.7](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.6...@open-wc/eslint-config@0.3.7) (2019-01-21)


### Bug Fixes

* broken links in README ([5685887](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/5685887))





## [0.3.6](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.5...@open-wc/eslint-config@0.3.6) (2019-01-20)


### Bug Fixes

* refactor generators ([1dab1f4](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/1dab1f4))





## [0.3.5](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.4...@open-wc/eslint-config@0.3.5) (2019-01-19)


### Bug Fixes

* restructure menu and improve docu ([dd37e22](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/dd37e22))





## [0.3.4](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.3...@open-wc/eslint-config@0.3.4) (2019-01-16)


### Bug Fixes

* improve documentation ([4f5472f](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/4f5472f))





## [0.3.3](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.2...@open-wc/eslint-config@0.3.3) (2018-12-20)


### Bug Fixes

* linting generators & documentation ([5c29f7a](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/5c29f7a))





## [0.3.2](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.1...@open-wc/eslint-config@0.3.2) (2018-12-13)


### Bug Fixes

* apply prettier; add lint-staged ([43acfad](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/43acfad))





## [0.3.1](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.3.0...@open-wc/eslint-config@0.3.1) (2018-11-30)


### Bug Fixes

* move documentation to READMEs of packages ([b4a0426](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/b4a0426))





# [0.3.0](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.2.1...@open-wc/eslint-config@0.3.0) (2018-11-18)


### Features

* use es module chai version; auto-register side-effects ([263f4ff](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/263f4ff))





## [0.2.1](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.2.0...@open-wc/eslint-config@0.2.1) (2018-10-28)


### Bug Fixes

* use version ranges ([694e137](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/694e137))





# [0.2.0](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.1.1...@open-wc/eslint-config@0.2.0) (2018-10-06)


### Bug Fixes

* **eslint-config:** test/stories folder may import from devDependencies ([80bd9e9](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/80bd9e9))
* add minimal readme ([9e52ca2](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/9e52ca2))


### Features

* **test:** add karma and browserstack ([5aff947](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/5aff947))





<a name="0.1.1"></a>
## [0.1.1](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/compare/@open-wc/eslint-config@0.1.0...@open-wc/eslint-config@0.1.1) (2018-09-29)


### Bug Fixes

* **eslint-config:** Use babel-eslint to support dynamic imports ([5826475](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/5826475))





<a name="0.1.0"></a>
# 0.1.0 (2018-09-17)


### Features

* initial release ([54d963d](https://github.com/open-wc/open-wc/tree/master/packages/eslint-config/commit/54d963d))
