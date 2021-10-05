# Change Log

## 2.0.0-next.3

### Patch Changes

- 72e67571: Fix type error caused by `getScopedElementsTemplate` by adding `ScopedElementsTemplateGetter`

## 2.0.0-next.2

### Minor Changes

- 22c4017c: Undo deprecation of the `html` and `unsafeStatic` exports to enable matching lit versions to what is used in fixture.

  A typical testing file looks like this

  ```js
  import { html, fixture } from '@open-wc/testing'; // html will be lit-html 2.x

  it('works for tags', async () => {
    const el = await fixture(
      html`
        <my-el></my-el>
      `,
    );
  });
  ```

  With this export you can combine the usage of lit-html 2.x for the fixture and template rendering in lit-html 1.x

  ```js
  import { html as fixtureHtml, fixture } from '@open-wc/testing'; // fixtureHtml will be lit-html 2.x
  import { html } from 'my-library'; // html will be lit-html 1.x

  it('works for tags', async () => {
    const el = await fixture(fixtureHtml`<my-el></my-el>`);
  });

  it('can be combined', async () => {
    class MyExtension extends LibraryComponent {
      render() {
        // needs to be lit-html 1.x as the library component is using LitElement with lit-html 1.x
        return html`
          <p>...</p>
        `;
      }
    }

    // fixture requires a lit-html 2.x template
    const el = await fixture(fixtureHtml`<my-el></my-el>`);
  });
  ```

  NOTE: If you are using fixture for testing your lit-html 1.x directives then this will no longer work.
  A possible workaround for this is

  ```js
  import { html, fixture } from '@open-wc/testing'; // html will be lit-html 2.x
  import { render, html as html1, fancyDirective } from 'my-library'; // html and render will be lit-html 1.x

  it('is a workaround for directives', async () => {
    const node = document.createElement('div');
    render(html1`<p>Testing ${fancyDirective('output')}</p>`, node);

    // you can either cleanup yourself or use fixture
    const el = await fixture(
      html`
        ${node}
      `,
    );

    expect(el.children[0].innerHTML).toBe('Testing [[output]]');
  });
  ```

## 2.0.0-next.1

### Patch Changes

- 4b9ea6f6: Use lit@2.0 stable based dependencies across the project.
- 45c7fcc1: Import scoped registries code dynamically to prevent library consumers that do not leverage this API from being bound to its load order requirements.
- Updated dependencies [4b9ea6f6]
  - @open-wc/scoped-elements@2.0.0-next.6

## 2.0.0-next.0

### Major Changes

- 689c9ea3: Upgrade to support latest `lit` package.

  - the exports `html` and `unsafeStatic` are now deprecated we recommend to import them directly from `lit/static-html.js`;
  - You need to load a polyfill for the scoped registry if you wanna use the `scopedElements` option
  - We now enforce our entrypoints via an export map
  - The side effect free import got renamed to `pure`

    ```js
    // old
    import { fixture } from '@open-wc/testing-helpers/index-no-side-effects.js';
    // new
    import { fixture } from '@open-wc/testing-helpers/pure';
    ```

### Patch Changes

- Updated dependencies [edca5a82]
  - @open-wc/scoped-elements@2.0.0-next.0

## 1.8.12

### Patch Changes

- 4a81d791: Add types folder to npm artifacts
- Updated dependencies [4a81d791]
  - @open-wc/scoped-elements@1.2.4

## 1.8.11

### Patch Changes

- 17e9e7dc: Change type distribution workflow
- Updated dependencies [17e9e7dc]
  - @open-wc/scoped-elements@1.2.3

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.8.10](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.9...@open-wc/testing-helpers@1.8.10) (2020-10-02)

### Bug Fixes

- **testing-helpers:** replace ts-expect-error with ignore ([f64ed31](https://github.com/open-wc/open-wc/commit/f64ed31c4595019636ff8afc249fb9c01b858522))

## [1.8.9](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.8...@open-wc/testing-helpers@1.8.9) (2020-08-19)

### Bug Fixes

- **scoped-elements:** add host to the mixin type for static props ([88ffd99](https://github.com/open-wc/open-wc/commit/88ffd995efeb94d79ee686f665d18e8ca405e3bc))

## [1.8.8](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.7...@open-wc/testing-helpers@1.8.8) (2020-08-16)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.8.7](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.6...@open-wc/testing-helpers@1.8.7) (2020-08-14)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.8.6](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.5...@open-wc/testing-helpers@1.8.6) (2020-08-05)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.8.5](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.4...@open-wc/testing-helpers@1.8.5) (2020-08-04)

### Bug Fixes

- **testing-helpers:** change default timeout to 1000ms for waitUntil ([dacf46f](https://github.com/open-wc/open-wc/commit/dacf46faccc9939e26902ef4fbbb102418b81ba2))

## [1.8.4](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.3...@open-wc/testing-helpers@1.8.4) (2020-07-08)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.8.3](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.2...@open-wc/testing-helpers@1.8.3) (2020-06-15)

### Bug Fixes

- **testing-helpers:** auto-generate scoped elements test wrapper name ([439b39f](https://github.com/open-wc/open-wc/commit/439b39f9c0553754cd99f0f94f56525854c5a9eb))

## [1.8.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.1...@open-wc/testing-helpers@1.8.2) (2020-05-01)

### Bug Fixes

- **testing-helpers:** await to the wrong element ([79575e1](https://github.com/open-wc/open-wc/commit/79575e16bf8d64f4eefd237f25000d9aae01edab))
- **testing-helpers:** move peerDependencies to dependencies ([b2380eb](https://github.com/open-wc/open-wc/commit/b2380eb992bef13927c846499a8bab96714cc60e))

## [1.8.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.8.0...@open-wc/testing-helpers@1.8.1) (2020-04-26)

### Bug Fixes

- **testing-helpers:** constrain the type of defineCE ([#1470](https://github.com/open-wc/open-wc/issues/1470)) ([1341fa9](https://github.com/open-wc/open-wc/commit/1341fa96ad8adc83c9546cab1e1f6f62c1960322))

# [1.8.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.7.2...@open-wc/testing-helpers@1.8.0) (2020-04-26)

### Features

- **testing-helpers:** add scoped-elements support ([f265d9e](https://github.com/open-wc/open-wc/commit/f265d9e9d50bda1410f0681e90f6c58a65f347eb))

## [1.7.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.7.1...@open-wc/testing-helpers@1.7.2) (2020-04-20)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.7.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.7.0...@open-wc/testing-helpers@1.7.1) (2020-04-12)

**Note:** Version bump only for package @open-wc/testing-helpers

# [1.7.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.6.2...@open-wc/testing-helpers@1.7.0) (2020-04-05)

### Features

- **testing-helpers:** add fixture option to define wrapper el ([e7db9f6](https://github.com/open-wc/open-wc/commit/e7db9f69f0534be2348d85c2976da6d41757bdfb))

## [1.6.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.6.1...@open-wc/testing-helpers@1.6.2) (2020-03-19)

### Bug Fixes

- **testing-helpers:** publish typescript definition files again ([a411293](https://github.com/open-wc/open-wc/commit/a411293282e3133becd2ebc4c27d309a4f866a4d))

## [1.6.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.6.0...@open-wc/testing-helpers@1.6.1) (2020-03-19)

**Note:** Version bump only for package @open-wc/testing-helpers

# [1.6.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.5.3...@open-wc/testing-helpers@1.6.0) (2020-03-10)

### Features

- **testing-helpers:** support fixture cleanup in tdd style tests with 'teardown' ([#1410](https://github.com/open-wc/open-wc/issues/1410)) ([ce8c833](https://github.com/open-wc/open-wc/commit/ce8c8337da2d07d82f40e778d37a709093606b7e))

## [1.5.3](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.5.2...@open-wc/testing-helpers@1.5.3) (2020-03-10)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.5.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.5.1...@open-wc/testing-helpers@1.5.2) (2020-02-09)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.5.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.5.0...@open-wc/testing-helpers@1.5.1) (2020-01-19)

**Note:** Version bump only for package @open-wc/testing-helpers

# [1.5.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.4.0...@open-wc/testing-helpers@1.5.0) (2020-01-07)

### Features

- **testing-helpers:** add waitUntil helper ([bef5dac](https://github.com/open-wc/open-wc/commit/bef5dac522f8bb0e497d0dd0e24eadbf39b98987))

# [1.4.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.3.0...@open-wc/testing-helpers@1.4.0) (2019-11-24)

### Features

- update to use auto compatibility of es-dev-server ([f6d085e](https://github.com/open-wc/open-wc/commit/f6d085eda5a05391d1a464b9e49222c78194b0d9))

# [1.3.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.2.3...@open-wc/testing-helpers@1.3.0) (2019-11-02)

### Features

- **testing-helpers:** allow rendering non-TemplateResult ([#910](https://github.com/open-wc/open-wc/issues/910)) ([15345c7](https://github.com/open-wc/open-wc/commit/15345c7))

## [1.2.3](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.2.2...@open-wc/testing-helpers@1.2.3) (2019-10-25)

### Bug Fixes

- align used mocha version ([#901](https://github.com/open-wc/open-wc/issues/901)) ([3606381](https://github.com/open-wc/open-wc/commit/3606381))

## [1.2.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.2.1...@open-wc/testing-helpers@1.2.2) (2019-10-23)

### Bug Fixes

- add package keywords ([#859](https://github.com/open-wc/open-wc/issues/859)) ([cd78405](https://github.com/open-wc/open-wc/commit/cd78405))
- do not destructure exports to support es-module-lexer ([3709413](https://github.com/open-wc/open-wc/commit/3709413))

## [1.2.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.2.0...@open-wc/testing-helpers@1.2.1) (2019-08-18)

### Bug Fixes

- include \*.ts files in npm packages ([8087906](https://github.com/open-wc/open-wc/commit/8087906))

# [1.2.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.1.7...@open-wc/testing-helpers@1.2.0) (2019-08-18)

### Bug Fixes

- align sinon version ([0d529bf](https://github.com/open-wc/open-wc/commit/0d529bf))
- use chai instead of @bundled-es-modules/chai ([f9d19bb](https://github.com/open-wc/open-wc/commit/f9d19bb))

### Features

- add type definition files for testing ([462a29f](https://github.com/open-wc/open-wc/commit/462a29f))

## [1.1.7](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.1.6...@open-wc/testing-helpers@1.1.7) (2019-08-05)

### Bug Fixes

- cleanup package.json scripts ([be6bdb5](https://github.com/open-wc/open-wc/commit/be6bdb5))

## [1.1.6](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.1.5...@open-wc/testing-helpers@1.1.6) (2019-08-04)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.1.5](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.1.4...@open-wc/testing-helpers@1.1.5) (2019-08-04)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.1.4](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.1.3...@open-wc/testing-helpers@1.1.4) (2019-08-04)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.1.3](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.1.2...@open-wc/testing-helpers@1.1.3) (2019-08-04)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.1.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.1.1...@open-wc/testing-helpers@1.1.2) (2019-07-30)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.1.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.1.0...@open-wc/testing-helpers@1.1.1) (2019-07-28)

**Note:** Version bump only for package @open-wc/testing-helpers

# [1.1.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.24...@open-wc/testing-helpers@1.1.0) (2019-07-27)

### Features

- expose elementUpdated testing-helper by default ([#653](https://github.com/open-wc/open-wc/issues/653)) ([55a165f](https://github.com/open-wc/open-wc/commit/55a165f))

## [1.0.24](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.23...@open-wc/testing-helpers@1.0.24) (2019-07-26)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.23](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.22...@open-wc/testing-helpers@1.0.23) (2019-07-25)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.22](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.21...@open-wc/testing-helpers@1.0.22) (2019-07-24)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.21](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.20...@open-wc/testing-helpers@1.0.21) (2019-07-24)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.20](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.19...@open-wc/testing-helpers@1.0.20) (2019-07-24)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.19](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.18...@open-wc/testing-helpers@1.0.19) (2019-07-24)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.18](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.17...@open-wc/testing-helpers@1.0.18) (2019-07-22)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.17](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.16...@open-wc/testing-helpers@1.0.17) (2019-07-22)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.16](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.15...@open-wc/testing-helpers@1.0.16) (2019-07-19)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.15](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.14...@open-wc/testing-helpers@1.0.15) (2019-07-17)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.14](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.13...@open-wc/testing-helpers@1.0.14) (2019-07-17)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.13](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.12...@open-wc/testing-helpers@1.0.13) (2019-07-17)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.12](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.11...@open-wc/testing-helpers@1.0.12) (2019-07-15)

### Bug Fixes

- adopt to new testing-karma setup ([bdcc717](https://github.com/open-wc/open-wc/commit/bdcc717))

## [1.0.11](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.10...@open-wc/testing-helpers@1.0.11) (2019-07-13)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.10](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.9...@open-wc/testing-helpers@1.0.10) (2019-07-08)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.9](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.8...@open-wc/testing-helpers@1.0.9) (2019-07-08)

### Bug Fixes

- use file extensions for imports to support import maps ([c711b13](https://github.com/open-wc/open-wc/commit/c711b13))

## [1.0.8](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.7...@open-wc/testing-helpers@1.0.8) (2019-07-08)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.7](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.6...@open-wc/testing-helpers@1.0.7) (2019-07-08)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.6](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.5...@open-wc/testing-helpers@1.0.6) (2019-07-02)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.5](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.4...@open-wc/testing-helpers@1.0.5) (2019-07-02)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.4](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.3...@open-wc/testing-helpers@1.0.4) (2019-06-30)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.3](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.2...@open-wc/testing-helpers@1.0.3) (2019-06-23)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.1...@open-wc/testing-helpers@1.0.2) (2019-06-23)

**Note:** Version bump only for package @open-wc/testing-helpers

## [1.0.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@1.0.0...@open-wc/testing-helpers@1.0.1) (2019-06-18)

**Note:** Version bump only for package @open-wc/testing-helpers

# [1.0.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.9.6...@open-wc/testing-helpers@1.0.0) (2019-06-14)

### Features

- utils and webpack plugin for an index.html entrypoint ([#474](https://github.com/open-wc/open-wc/issues/474)) ([c382cc7](https://github.com/open-wc/open-wc/commit/c382cc7))

### BREAKING CHANGES

- Replaced webpack html plugin with index html plugin

## [0.9.6](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.9.5...@open-wc/testing-helpers@0.9.6) (2019-06-08)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.9.5](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.9.4...@open-wc/testing-helpers@0.9.5) (2019-05-25)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.9.4](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.9.3...@open-wc/testing-helpers@0.9.4) (2019-05-19)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.9.3](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.9.2...@open-wc/testing-helpers@0.9.3) (2019-05-14)

### Bug Fixes

- **testing-helpers:** more work for IE11 flaky focus/blur ([29bedd1](https://github.com/open-wc/open-wc/commit/29bedd1))

## [0.9.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.9.1...@open-wc/testing-helpers@0.9.2) (2019-05-14)

### Bug Fixes

- **testing-helpers:** force focus/blur for IE ([#457](https://github.com/open-wc/open-wc/issues/457)) ([e06b5ce](https://github.com/open-wc/open-wc/commit/e06b5ce))

## [0.9.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.9.0...@open-wc/testing-helpers@0.9.1) (2019-05-06)

**Note:** Version bump only for package @open-wc/testing-helpers

# [0.9.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.10...@open-wc/testing-helpers@0.9.0) (2019-05-06)

### Features

- update to latest testing-karma config syntax ([465bfe0](https://github.com/open-wc/open-wc/commit/465bfe0))

## [0.8.10](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.9...@open-wc/testing-helpers@0.8.10) (2019-05-03)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.8.9](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.8...@open-wc/testing-helpers@0.8.9) (2019-04-28)

### Bug Fixes

- **eslint-config:** loosen up rules for test and stories files ([#408](https://github.com/open-wc/open-wc/issues/408)) ([3fd251e](https://github.com/open-wc/open-wc/commit/3fd251e))

## [0.8.8](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.7...@open-wc/testing-helpers@0.8.8) (2019-04-14)

### Bug Fixes

- update generator usage ([5d284d4](https://github.com/open-wc/open-wc/commit/5d284d4))

## [0.8.7](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.6...@open-wc/testing-helpers@0.8.7) (2019-04-13)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.8.6](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.5...@open-wc/testing-helpers@0.8.6) (2019-04-08)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.8.5](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.4...@open-wc/testing-helpers@0.8.5) (2019-04-06)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.8.4](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.3...@open-wc/testing-helpers@0.8.4) (2019-04-05)

### Bug Fixes

- do not assume available global types of users ([cd394d9](https://github.com/open-wc/open-wc/commit/cd394d9))

## [0.8.3](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.2...@open-wc/testing-helpers@0.8.3) (2019-03-31)

### Bug Fixes

- adopt new karma setup for all packages ([1888260](https://github.com/open-wc/open-wc/commit/1888260))

## [0.8.2](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.1...@open-wc/testing-helpers@0.8.2) (2019-03-24)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.8.1](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.8.0...@open-wc/testing-helpers@0.8.1) (2019-03-23)

### Bug Fixes

- do not assume globally setup mocha types ([977d5b4](https://github.com/open-wc/open-wc/commit/977d5b4))

# [0.8.0](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.25...@open-wc/testing-helpers@0.8.0) (2019-03-23)

### Features

- add types + linting & improve intellisense ([b6d260c](https://github.com/open-wc/open-wc/commit/b6d260c))

## [0.7.25](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.24...@open-wc/testing-helpers@0.7.25) (2019-03-20)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.24](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.23...@open-wc/testing-helpers@0.7.24) (2019-03-14)

### Bug Fixes

- **testing-helpers:** ensure ShadyDOM finished its job in fixture ([4fbe93d](https://github.com/open-wc/open-wc/commit/4fbe93d))

## [0.7.23](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.22...@open-wc/testing-helpers@0.7.23) (2019-03-14)

### Bug Fixes

- **testing-helpers:** make fixture type generic ([613a672](https://github.com/open-wc/open-wc/commit/613a672))

## [0.7.22](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.21...@open-wc/testing-helpers@0.7.22) (2019-03-08)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.21](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.20...@open-wc/testing-helpers@0.7.21) (2019-03-06)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.20](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.19...@open-wc/testing-helpers@0.7.20) (2019-03-04)

### Bug Fixes

- **testing-helpers:** correct usage of oneEvent in readme ([a16969a](https://github.com/open-wc/open-wc/commit/a16969a))

## [0.7.19](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.18...@open-wc/testing-helpers@0.7.19) (2019-03-03)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.18](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.17...@open-wc/testing-helpers@0.7.18) (2019-02-26)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.17](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.16...@open-wc/testing-helpers@0.7.17) (2019-02-24)

### Bug Fixes

- **testing-helpers:** add time before triggering focus/blur (only IE) ([f77cfa2](https://github.com/open-wc/open-wc/commit/f77cfa2))

## [0.7.16](https://github.com/open-wc/open-wc/compare/@open-wc/testing-helpers@0.7.15...@open-wc/testing-helpers@0.7.16) (2019-02-16)

### Bug Fixes

- update package repository fields with monorepo details ([cb1acb7](https://github.com/open-wc/open-wc/commit/cb1acb7))

## [0.7.15](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.14...@open-wc/testing-helpers@0.7.15) (2019-02-14)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.14](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.13...@open-wc/testing-helpers@0.7.14) (2019-02-13)

### Bug Fixes

- **testing-helpers:** raise peer dependency of lit-html to 1.x ([1744317](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/1744317))

## [0.7.13](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.12...@open-wc/testing-helpers@0.7.13) (2019-02-11)

### Bug Fixes

- **testing-helpers:** document oneEvent, triggerFocusFor, triggerBlurFor ([a591611](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/a591611))
- **testing-helpers:** use asynchronous fixtures ([7b6372b](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/7b6372b))

## [0.7.12](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.11...@open-wc/testing-helpers@0.7.12) (2019-02-04)

### Bug Fixes

- **testing-helpers:** add `await elementUpdated(el)` supports stencil ([c442f21](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/c442f21))

## [0.7.11](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.10...@open-wc/testing-helpers@0.7.11) (2019-02-02)

### Bug Fixes

- unify npm readme header for all open-wc packages ([1bac939](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/1bac939))

## [0.7.10](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.9...@open-wc/testing-helpers@0.7.10) (2019-02-02)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.9](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.8...@open-wc/testing-helpers@0.7.9) (2019-01-26)

### Bug Fixes

- align all open-wc readme headers ([b589429](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/b589429))

## [0.7.8](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.7...@open-wc/testing-helpers@0.7.8) (2019-01-26)

### Bug Fixes

- **testing-helpers:** fixture waits for elements updateComplete ([a80a625](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/a80a625))
- **testing-helpers:** flaky IE11 blur/focus helpers ([aa91e06](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/aa91e06))

## [0.7.7](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.6...@open-wc/testing-helpers@0.7.7) (2019-01-24)

### Bug Fixes

- add docu for fixtureCleanup ([ab0170a](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/ab0170a))

## [0.7.6](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.5...@open-wc/testing-helpers@0.7.6) (2019-01-20)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.5](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.4...@open-wc/testing-helpers@0.7.5) (2019-01-19)

### Bug Fixes

- move fixtureCleanup to testing helpers ([#136](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/issues/136)) ([9d268ab](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/9d268ab))

## [0.7.4](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.3...@open-wc/testing-helpers@0.7.4) (2019-01-19)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.3](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.2...@open-wc/testing-helpers@0.7.3) (2019-01-16)

### Bug Fixes

- improve documentation ([4f5472f](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/4f5472f))

## [0.7.2](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.1...@open-wc/testing-helpers@0.7.2) (2019-01-09)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.7.1](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.7.0...@open-wc/testing-helpers@0.7.1) (2019-01-03)

### Bug Fixes

- **testing-helpers:** add await to fixture example in docs ([393f3ed](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/393f3ed))

# [0.7.0](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.6.4...@open-wc/testing-helpers@0.7.0) (2019-01-02)

### Features

- **testing-helpers:** fixture can handle strings and TemplateResults ([0649ea0](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/0649ea0))

## [0.6.4](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.6.3...@open-wc/testing-helpers@0.6.4) (2018-12-23)

### Bug Fixes

- **testing-helpers:** on IE set timeout to 2ms for blur/focus trigger ([c62b684](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/c62b684))

## [0.6.3](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.6.2...@open-wc/testing-helpers@0.6.3) (2018-12-22)

### Bug Fixes

- **testing-helpers:** adopt fixture/litFixture typings ([57764fe](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/57764fe))
- **testing-helpers:** remove deprecated flush ([df077dc](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/df077dc))

## [0.6.2](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.6.1...@open-wc/testing-helpers@0.6.2) (2018-12-20)

### Bug Fixes

- properly apply prettier ([a12bb09](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/a12bb09))

## [0.6.1](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.6.0...@open-wc/testing-helpers@0.6.1) (2018-12-20)

**Note:** Version bump only for package @open-wc/testing-helpers

# [0.6.0](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.5.2...@open-wc/testing-helpers@0.6.0) (2018-12-19)

### Features

- use extendable karma configs by default ([8fd9435](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/8fd9435))

## [0.5.2](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.5.1...@open-wc/testing-helpers@0.5.2) (2018-12-18)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.5.1](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.5.0...@open-wc/testing-helpers@0.5.1) (2018-12-13)

### Bug Fixes

- apply prettier; add lint-staged ([43acfad](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/43acfad))

# [0.5.0](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.4.3...@open-wc/testing-helpers@0.5.0) (2018-12-11)

### Features

- add typescript type declaration files ([f5cb243](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/f5cb243))

## [0.4.3](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.4.2...@open-wc/testing-helpers@0.4.3) (2018-12-02)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.4.2](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.4.1...@open-wc/testing-helpers@0.4.2) (2018-12-01)

**Note:** Version bump only for package @open-wc/testing-helpers

## [0.4.1](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.4.0...@open-wc/testing-helpers@0.4.1) (2018-11-30)

### Bug Fixes

- move documentation to READMEs of packages ([b4a0426](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/b4a0426))

# [0.4.0](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.3.0...@open-wc/testing-helpers@0.4.0) (2018-11-26)

### Features

- use latest testing-karma features ([5edc46c](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/5edc46c))

# [0.3.0](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.2.1...@open-wc/testing-helpers@0.3.0) (2018-11-18)

### Features

- sinon is no longer a mandatory package ([ef97cec](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/ef97cec))
- use es module chai version; auto-register side-effects ([263f4ff](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/263f4ff))

## [0.2.1](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.2.0...@open-wc/testing-helpers@0.2.1) (2018-11-16)

**Note:** Version bump only for package @open-wc/testing-helpers

# [0.2.0](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.1.2...@open-wc/testing-helpers@0.2.0) (2018-11-15)

### Features

- simplify testing-helpers names ([68e1cb5](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/68e1cb5))

## [0.1.2](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.1.1...@open-wc/testing-helpers@0.1.2) (2018-11-05)

### Bug Fixes

- add karma.conf.js to npmignore ([9700532](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/9700532))

## [0.1.1](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/compare/@open-wc/testing-helpers@0.1.0...@open-wc/testing-helpers@0.1.1) (2018-11-05)

### Bug Fixes

- add an npmignore file ([ddceeca](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/ddceeca))

# 0.1.0 (2018-11-03)

### Features

- add testing-helpers package ([90428f7](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers/commit/90428f7))
