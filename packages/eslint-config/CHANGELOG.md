# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
