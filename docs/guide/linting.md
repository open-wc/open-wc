# Linting

In order to write consistent code it's good to have strict linting rules.
Also these rules should be checked and applied in an automatic manner.

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
- copy [.eslintignore](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-eslint/templates/static/.eslintignore) to `.eslintignore`
- copy [.eslintrc.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-prettier/templates/static/.eslintrc.js) to `.eslintrc.js`
- copy [.prettierignore](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-prettier/templates/static/.prettierignore) to `.prettierignore`
- copy [prettier.config.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-prettier/templates/_prettier.config.js) to `prettier.config.js`
- copy [husky.config.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint/templates/static/husky.config.js) to `husky.config.js`
- copy [commitlint.config.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-commitlint/templates/static/commitlint.config.js) to `commitlint.config.js`
- add these scripts to your package.json
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

- linting and auto formatting using eslint & prettier
- full automatic linting for changed files on commit
- linting commit message

## Usage

Run:
- `npm run lint` to check if any file is not correctly formatted
- `npm run format` to auto format your files

Whenever you create a commit the update files will be auto formatted and the commit message will be linted.

## Linting Error Examples

```bash
$ npm run lint:prettier

test/set-card.test.js
test/set-game.test.js
↑↑ these files are not prettier formatted ↑↑
```

So just run `npm run format:prettier` to format those files automatically.

```bash
$ npm run lint:eslint

/.../example-vanilla-set-game/set-card.js
  14:11  error  'foo' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

If you are using eslint and prettier togeter most eslint errors will not be auto fixable.
This means usually you will need to pick up an editor and actually fix the problem in code.
