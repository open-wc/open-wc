# Change Log

## 2.0.0-next.5

### Patch Changes

- ff17798f: Adjust the renderBefore node so that any styles in Lit content render before adoptedStyleSheets.

## 2.0.0-next.4

### Minor Changes

- 1e54d297: Use the webcomponents polyfill instead of the forked one

## 2.0.0-next.3

### Patch Changes

- 0513917c: Keep deprecated static getScopedTagName function

## 2.0.0-next.2

### Patch Changes

- a0b5e360: fix getScopedTagName returning the tag that was passed in

## 2.0.0-next.1

### Patch Changes

- c05d92fb: Mark `loadPolyfill.js` as a side effect

## 2.0.0-next.0

### Major Changes

- edca5a82: Adds compatibility for [lit](https://lit.dev/) with `lit-html v2` and `lit-element v3`.

  - This version does NOT work with lit-element v2 - please use Scoped Elements v1 for it
  - Uses a `CustomElementsRegistry` instance for each component class instead of for each component instance. In case you need to have a registry for each component instance, you must override the registry `get` and `set` methods to bind the registry to the component instance

    ```js
    /** @override */
    get registry() {
      return this.__registry;
    }

    /** @override */
    set registry(registry) {
      this.__registry = registry;
    }
    ```

  - `getScopedTagName` became deprecated - use the native `el.tagName` instead

## 1.3.3

### Patch Changes

- 31ff454a: Add constructor to ScopedElementsHost type so that base constructors have the same return type as extensions. See [TypeScript issue](https://github.com/microsoft/TypeScript/issues/40110).

## 1.3.2

### Patch Changes

- 9fb1c131: refactor to remove optional chaining syntax in Cache file for better tooling compatibility

## 1.3.1

### Patch Changes

- 04666893: Fix types

## 1.3.0

### Minor Changes

- 95d055dc: Define lazy components per Scoped Element instance instead of by Scoped Element class. This forces `getScopedTagName` method to stop being a static method.

## 1.2.4

### Patch Changes

- 4a81d791: Add types folder to npm artifacts

## 1.2.3

### Patch Changes

- 17e9e7dc: Change type distribution workflow

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.2](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.2.1...@open-wc/scoped-elements@1.2.2) (2020-08-19)

### Bug Fixes

- **scoped-elements:** add host to the mixin type for static props ([88ffd99](https://github.com/open-wc/open-wc/commit/88ffd995efeb94d79ee686f665d18e8ca405e3bc))

## [1.2.1](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.2.0...@open-wc/scoped-elements@1.2.1) (2020-08-14)

### Bug Fixes

- **scoped-elements:** make code ie11 compatible ([08483df](https://github.com/open-wc/open-wc/commit/08483df864276f7d1ac5a72ca0fc1b37ad6367df))

# [1.2.0](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.1.2...@open-wc/scoped-elements@1.2.0) (2020-08-05)

### Features

- **scoped-elements:** add data-tag-name with the original tagName ([d97454e](https://github.com/open-wc/open-wc/commit/d97454ea7e39457b754ee907c6d686aba5d5078b))

## [1.1.2](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.1.1...@open-wc/scoped-elements@1.1.2) (2020-07-08)

**Note:** Version bump only for package @open-wc/scoped-elements

## [1.1.1](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.1.0...@open-wc/scoped-elements@1.1.1) (2020-04-26)

### Bug Fixes

- **scoped-elements:** duplicate definition ([9aecafb](https://github.com/open-wc/open-wc/commit/9aecafbd68b8eb6a77f9d6fd8420e7693c3e8eef))

# [1.1.0](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.9...@open-wc/scoped-elements@1.1.0) (2020-04-25)

### Features

- **scoped-elements:** self-registering components compatibility ([d4806e4](https://github.com/open-wc/open-wc/commit/d4806e43972c6cf2b895998a521ff89d5f16583d))

## [1.0.9](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.8...@open-wc/scoped-elements@1.0.9) (2020-04-20)

**Note:** Version bump only for package @open-wc/scoped-elements

## [1.0.8](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.7...@open-wc/scoped-elements@1.0.8) (2020-04-12)

**Note:** Version bump only for package @open-wc/scoped-elements

## [1.0.7](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.6...@open-wc/scoped-elements@1.0.7) (2020-04-06)

**Note:** Version bump only for package @open-wc/scoped-elements

## [1.0.6](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.5...@open-wc/scoped-elements@1.0.6) (2020-04-05)

### Bug Fixes

- **scoped-elements:** define unused lazy scoped elements ([5b863a2](https://github.com/open-wc/open-wc/commit/5b863a2bbaa8647b29cc6818ffb6dadc7297caae))

## [1.0.5](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.4...@open-wc/scoped-elements@1.0.5) (2020-03-28)

### Bug Fixes

- **scoped-elements:** elements not scoped by directives ([71f7438](https://github.com/open-wc/open-wc/commit/71f7438308d010148f80abdafd7e7dcb828e529c))

## [1.0.4](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.3...@open-wc/scoped-elements@1.0.4) (2020-03-26)

**Note:** Version bump only for package @open-wc/scoped-elements

## [1.0.3](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.2...@open-wc/scoped-elements@1.0.3) (2020-03-25)

### Bug Fixes

- **scoped-elements:** getScopedTagName returns undefined ([a96c675](https://github.com/open-wc/open-wc/commit/a96c675d36b2c04ba84c11c706400cd8ecaaf584))

## [1.0.2](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.1...@open-wc/scoped-elements@1.0.2) (2020-03-24)

**Note:** Version bump only for package @open-wc/scoped-elements

## [1.0.1](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@1.0.0...@open-wc/scoped-elements@1.0.1) (2020-03-20)

**Note:** Version bump only for package @open-wc/scoped-elements

# [1.0.0](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.7.1...@open-wc/scoped-elements@1.0.0) (2020-03-19)

### Bug Fixes

- **scoped-elements:** fix some jsDocs ([b4d4fc1](https://github.com/open-wc/open-wc/commit/b4d4fc14a01c35e9b50ea7c87110853e0b18b1a3))

### BREAKING CHANGES

- **scoped-elements:** getScopedTagName is not available anymore as a function but
            a ScopedElementsMixin method.

## [0.7.1](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.7.0...@open-wc/scoped-elements@0.7.1) (2020-03-19)

**Note:** Version bump only for package @open-wc/scoped-elements

# [0.7.0](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.9...@open-wc/scoped-elements@0.7.0) (2020-03-19)

### Features

- **scoped-elements:** add support for lazy elements ([0d67b9f](https://github.com/open-wc/open-wc/commit/0d67b9f8851e73a1a2dc48fe66717a62822fc4b7))

## [0.6.9](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.8...@open-wc/scoped-elements@0.6.9) (2020-03-19)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.6.8](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.7...@open-wc/scoped-elements@0.6.8) (2020-03-15)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.6.7](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.6...@open-wc/scoped-elements@0.6.7) (2020-03-15)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.6.6](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.5...@open-wc/scoped-elements@0.6.6) (2020-03-11)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.6.5](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.4...@open-wc/scoped-elements@0.6.5) (2020-03-10)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.6.4](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.3...@open-wc/scoped-elements@0.6.4) (2020-03-10)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.6.3](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.2...@open-wc/scoped-elements@0.6.3) (2020-03-08)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.6.2](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.1...@open-wc/scoped-elements@0.6.2) (2020-03-06)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.6.1](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.6.0...@open-wc/scoped-elements@0.6.1) (2020-03-02)

**Note:** Version bump only for package @open-wc/scoped-elements

# [0.6.0](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.5.0...@open-wc/scoped-elements@0.6.0) (2020-02-29)

### Features

- **rollup-plugin-html:** first release ([9acb29a](https://github.com/open-wc/open-wc/commit/9acb29ac84b0ef7e2b06c57043c9d2c76d5a29c0))

# [0.5.0](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.4.1...@open-wc/scoped-elements@0.5.0) (2020-02-24)

### Features

- **scoped-elements:** add getScopedTagName function ([21132e0](https://github.com/open-wc/open-wc/commit/21132e00f72111dbaaedddf659a84014359a4232))

## [0.4.1](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.4.0...@open-wc/scoped-elements@0.4.1) (2020-02-23)

**Note:** Version bump only for package @open-wc/scoped-elements

# [0.4.0](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.3.1...@open-wc/scoped-elements@0.4.0) (2020-02-19)

### Features

- **scoped-elements:** implement as ScopedElementsMixin ([b4f6483](https://github.com/open-wc/open-wc/commit/b4f648362234949572e1215e0b65df415e63d65c))

## [0.3.1](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.3.0...@open-wc/scoped-elements@0.3.1) (2020-02-13)

### Bug Fixes

- **scoped-elements:** support extending elements ([#1272](https://github.com/open-wc/open-wc/issues/1272)) ([9868bc7](https://github.com/open-wc/open-wc/commit/9868bc7a1bc94d4e54651c92d458f3b413a1ebda))

# [0.3.0](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.15...@open-wc/scoped-elements@0.3.0) (2020-02-13)

### Bug Fixes

- **scoped-elements:** keep descriptive tag name when building ([64b8a44](https://github.com/open-wc/open-wc/commit/64b8a44d23b51a7843185462f8b2204e522a07c8))

### Features

- **scoped-elements:** add '-se' suffix to all scoped tag names ([28c7011](https://github.com/open-wc/open-wc/commit/28c7011bb834638a6448b420ea4a4d844b151fe7))

## [0.2.15](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.14...@open-wc/scoped-elements@0.2.15) (2020-02-12)

### Bug Fixes

- add setting so webpack can apply tree shaking on it ([#1337](https://github.com/open-wc/open-wc/issues/1337)) ([b5fdf5c](https://github.com/open-wc/open-wc/commit/b5fdf5c2f124913ffd07b97dbbb666661e4ef480))

## [0.2.14](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.13...@open-wc/scoped-elements@0.2.14) (2020-02-10)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.13](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.12...@open-wc/scoped-elements@0.2.13) (2020-02-10)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.12](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.11...@open-wc/scoped-elements@0.2.12) (2020-02-09)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.11](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.10...@open-wc/scoped-elements@0.2.11) (2020-02-09)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.10](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.9...@open-wc/scoped-elements@0.2.10) (2020-02-06)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.9](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.8...@open-wc/scoped-elements@0.2.9) (2020-02-06)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.8](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.7...@open-wc/scoped-elements@0.2.8) (2020-02-03)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.7](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.6...@open-wc/scoped-elements@0.2.7) (2020-02-03)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.6](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.5...@open-wc/scoped-elements@0.2.6) (2020-02-02)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.5](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.3...@open-wc/scoped-elements@0.2.5) (2020-01-31)

### Bug Fixes

- skip brooken published versions ([25d21de](https://github.com/open-wc/open-wc/commit/25d21def522f22f98fc8c71b4c055617089c0e23))

## [0.2.3](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.2...@open-wc/scoped-elements@0.2.3) (2020-01-27)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.2](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.1...@open-wc/scoped-elements@0.2.2) (2020-01-27)

**Note:** Version bump only for package @open-wc/scoped-elements

## [0.2.1](https://github.com/open-wc/open-wc/compare/@open-wc/scoped-elements@0.2.0...@open-wc/scoped-elements@0.2.1) (2020-01-19)

**Note:** Version bump only for package @open-wc/scoped-elements

# 0.2.0 (2020-01-19)

### Features

- **scoped-elements:** add scoped elements feature ([a7e195b](https://github.com/open-wc/open-wc/commit/a7e195b893deaed8041b2952f51a5229e33134a1))
