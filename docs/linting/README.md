# Linting

Linting can help you write consistent code, and easily prevent mistakes. Open-wc recommends the following tools:

We recommend
- [ESLint](https://eslint.org/) to lint your es6 code
- [Prettier](https://prettier.io/) to auto format your code
- [lint-staged](https://www.npmjs.com/package/lint-staged) to apply linting fixed only to changed files
- [commitlint](https://www.npmjs.com/package/@commitlint/cli) so commit messages follow a certain flow

## Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:lint'
```

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

### Manual
- `yarn add --dev @open-wc/eslint-config @open-wc/prettier-config lint-staged husky @commitlint/cli @commitlint/config-conventional`
- Copy [.eslintignore](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-eslint/templates/static/.eslintignore) to `.eslintignore`
- Copy [.eslintrc.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-prettier/templates/static/.eslintrc.js) to `.eslintrc.js`
- Copy [.prettierignore](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-prettier/templates/static/.prettierignore) to `.prettierignore`
- Copy [prettier.config.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-prettier/templates/_prettier.config.js) to `prettier.config.js`
- Copy [husky.config.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint/templates/static/husky.config.js) to `husky.config.js`
- Copy [commitlint.config.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-commitlint/templates/static/commitlint.config.js) to `commitlint.config.js`
- Add these scripts to your package.json
  ```js
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  },
  "scripts": {
    "lint": "npm run lint:eslint && npm run lint:prettier",
    "lint:eslint": "eslint --ext .js,.html .",
    "lint:prettier": "prettier '**/*.js' --list-different || (echo '↑↑ these files are not prettier formatted ↑↑' && exit 1)",
    "format": "npm run format:eslint && npm run format:prettier",
    "format:eslint": "eslint --ext .js,.html . --fix",
    "format:prettier": "prettier '**/*.js' --write"
  },
  ```

## What you get

- Linting and auto formatting using eslint & prettier
- Full automatic linting for changed files on commit
- Linting commit message

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
