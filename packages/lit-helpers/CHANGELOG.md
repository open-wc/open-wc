# Change Log

## 0.7.0

### Minor Changes

- 0b35003d: Support lit@2 and lit@3

## 0.6.0

### Minor Changes

- 935c8ffe: Drop support for Node@14

## 0.5.1

### Patch Changes

- 7c9e5c42: Include spread types and exclude their TS source

## 0.5.0

### Minor Changes

- 667b6786: Add "spread", "spreadEvents", and "spreadProps" directives to support spreading objects of data onto elements in a `lit-html` template literal.

  Example of `spread`:

  ```js
  import { spread } from '@open-wc/lit-helpers';

  const elementTemplate = (
    obj = {
      'my-attribute': 'foo',
      '?my-boolean-attribute': true,
      '@my-event': () => console.log('my-event fired'),
      '.myProperty': { foo: 'bar' },
    },
  ) => html` <custom-element ${spread(obj)}></custom-element> `;
  ```

  Example of `spreadEvents`:

  ```js
  import { spreadEvents } from '@open-wc/lit-helpers';

  const elementTemplate = (
    obj = {
      'my-event': () => {
        console.log('my-event');
      },
      'my-other-event': () => {
        console.log('my-other-event');
      },
      'my-additional-event': () => {
        console.log('my-additional-event');
      },
    },
  ) => html` <custom-element ${spreadEvents(obj)}></custom-element> `;
  ```

  Example of `spreadProps`:

  ```js
  import { spreadProps } from '@open-wc/lit-helpers';

  const elementTemplate = (
    obj = {
      string: 'string',
      number: 10,
      array: ['This', 'is', 'an', 'array.'],
      object: {
        foo: 'bar',
        baz: true,
        bar: false,
      },
    },
  ) => html` <custom-element ${spreadProps(obj)}></custom-element> `;
  ```

## 0.4.1

### Patch Changes

- b3cc79ab: fix(lit-helpers): Removed type references to deprecated `live`, `spread`, and `spreadAttributes` directives

## 0.4.0

### Minor Changes

- f3cbb2a7: Removes directives from package

  - the `live` directive is in the official [lit](https://lit.dev/docs/templates/directives/#live) package.
  - the `spread` and `spreadProps` directives no longer work with the updated directive API of `lit`. They will need to be recreated and we will do this in [lit-labs](https://github.com/lit/lit/tree/main/packages/labs).
  - `import { /* ... */ } from '@open-wc/lit-helpers';` is now the only valid entrypoint

### Patch Changes

- 4b9ea6f6: Use lit@2.0 stable based dependencies across the project.

## 0.4.0-next.1

### Patch Changes

- 4b9ea6f6: Use lit@2.0 stable based dependencies across the project.

## 0.4.0-next.0

### Minor Changes

- f3cbb2a7: Removes directives from package

  - the `live` directive is in the official [lit](https://lit.dev/docs/templates/directives/#live) package.
  - the `spread` and `spreadProps` directives no longer work with the updated directive API of `lit`. They will need to be recreated and we will do this in [lit-labs](https://github.com/lit/lit/tree/main/packages/labs).
  - `import { /* ... */ } from '@open-wc/lit-helpers';` is now the only valid entrypoint

## 0.3.12

### Patch Changes

- f6159010: updated peer dependency version of lit-element to 2.x

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.3.11](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.10...@open-wc/lit-helpers@0.3.11) (2020-07-28)

### Bug Fixes

- **lit-helpers:** correct spread parameter type ([c0b5b14](https://github.com/open-wc/open-wc/commit/c0b5b145090460215d6540b025df57f361b36a05))

## [0.3.10](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.9...@open-wc/lit-helpers@0.3.10) (2020-05-25)

### Bug Fixes

- **lit-helpers:** spreadProps typings ([bd25344](https://github.com/open-wc/open-wc/commit/bd253440b687b2bebf4861b0e8a0fcb9f84ed83c))

## [0.3.9](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.8...@open-wc/lit-helpers@0.3.9) (2020-04-20)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.3.8](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.7...@open-wc/lit-helpers@0.3.8) (2020-04-12)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.3.7](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.6...@open-wc/lit-helpers@0.3.7) (2020-04-06)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.3.6](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.5...@open-wc/lit-helpers@0.3.6) (2020-04-05)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.3.5](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.4...@open-wc/lit-helpers@0.3.5) (2020-03-19)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.3.4](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.3...@open-wc/lit-helpers@0.3.4) (2020-03-19)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.3.3](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.2...@open-wc/lit-helpers@0.3.3) (2020-03-10)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.3.2](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.1...@open-wc/lit-helpers@0.3.2) (2020-03-10)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.3.1](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.3.0...@open-wc/lit-helpers@0.3.1) (2020-02-22)

### Bug Fixes

- **lit-helpers:** add type declarations for exports ([#1363](https://github.com/open-wc/open-wc/issues/1363)) ([703f57d](https://github.com/open-wc/open-wc/commit/703f57d655f6c8016f891731ec2c22abff73d455))

# [0.3.0](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.10...@open-wc/lit-helpers@0.3.0) (2020-02-22)

### Features

- **lit-helpers:** add ReadOnlyPropertiesMixin ([#1265](https://github.com/open-wc/open-wc/issues/1265)) ([18690c5](https://github.com/open-wc/open-wc/commit/18690c59acb86885da0546e80d12b4f8b1b3422e))

## [0.2.10](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.9...@open-wc/lit-helpers@0.2.10) (2020-02-12)

### Bug Fixes

- add setting so webpack can apply tree shaking on it ([#1337](https://github.com/open-wc/open-wc/issues/1337)) ([b5fdf5c](https://github.com/open-wc/open-wc/commit/b5fdf5c2f124913ffd07b97dbbb666661e4ef480))

## [0.2.9](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.8...@open-wc/lit-helpers@0.2.9) (2020-02-09)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.2.8](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.7...@open-wc/lit-helpers@0.2.8) (2020-02-06)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.2.7](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.6...@open-wc/lit-helpers@0.2.7) (2020-01-31)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.2.6](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.5...@open-wc/lit-helpers@0.2.6) (2020-01-19)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.2.5](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.4...@open-wc/lit-helpers@0.2.5) (2020-01-07)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.2.4](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.3...@open-wc/lit-helpers@0.2.4) (2020-01-07)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.2.3](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.2...@open-wc/lit-helpers@0.2.3) (2020-01-07)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.2.2](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.1...@open-wc/lit-helpers@0.2.2) (2019-12-08)

**Note:** Version bump only for package @open-wc/lit-helpers

## [0.2.1](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.2.0...@open-wc/lit-helpers@0.2.1) (2019-12-05)

**Note:** Version bump only for package @open-wc/lit-helpers

# [0.2.0](https://github.com/open-wc/open-wc/compare/@open-wc/lit-helpers@0.1.0...@open-wc/lit-helpers@0.2.0) (2019-12-01)

### Features

- **lit-helpers:** add live directive ([1079b0f](https://github.com/open-wc/open-wc/commit/1079b0f3c30a9ca20d9e166e54c2b4a273867db1))

# 0.1.0 (2019-11-30)

### Features

- **lit-helpers:** add spread directives ([#1023](https://github.com/open-wc/open-wc/issues/1023)) ([68d61ee](https://github.com/open-wc/open-wc/commit/68d61eeb5b187430f3c94369272b42cebd0f3df1))
