# Linting

Linting can help you write consistent code, and easily prevent mistakes. Open-wc recommends the following tools:

We recommend

- [ESLint](https://eslint.org/) to lint your es6 code
- [Prettier](https://prettier.io/) to auto format your code
- [lint-staged](https://www.npmjs.com/package/lint-staged) to apply linting fixed only to changed files

## Setup

```bash
npm init @open-wc
# Upgrade > Linting
```

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

### Manual

- Install needed dependencies
  ```bash
  npm add --save-dev @open-wc/eslint-config @open-wc/prettier-config lint-staged husky
  ```
- Adjust your package.json with the following
  ```js
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  },
  "scripts": {
    "lint": "npm run lint:eslint && npm run lint:prettier",
    "format": "npm run format:eslint && npm run format:prettier"
  },
  "devDependencies": {
    "husky": "^1.0.0",
    "lint-staged": "^8.0.0"
  }
  ```

## What you get

- Linting and auto formatting using eslint & prettier
- Full automatic linting for changed files on commit

## Usage

Run:

- `npm run lint` to check if any file is correctly formatted
- `npm run format` to auto format your files

Whenever you create a commit the update files will be auto formatted and the commit message will be linted for you.

## Linting Error Examples

```bash
$ npm run lint:prettier

test/set-card.test.js
test/set-game.test.js
↑↑ these files are not prettier formatted ↑↑
```

Simply run `npm run format:prettier` to format those files automatically.

```bash
$ npm run lint:eslint

/.../example-vanilla-set-game/set-card.js
  14:11  error  'foo' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

If you're using eslint and prettier together most eslint errors will not be auto fixable.
This means usually you will need to pick up an editor and actually fix the problem in code.
