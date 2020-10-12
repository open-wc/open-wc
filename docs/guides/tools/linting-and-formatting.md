# Tools >> Linting and Formatting ||40

We recommend using [ESLint](https://eslint.org/) to lint your code and [prettier](https://prettier.io/) to format your code.

This helps catch errors during development, keep a consistent code style, and avoid formatting creating large diffs in pull requests.

## Linting config

We recommend `@open-wc/eslint-config` for a good default configuration for web component projects.

The config includes smart defaults, and installs the following configs and plugins:

- [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) (with some modifications)
- [eslint-plugin-wc](https://www.npmjs.com/package/eslint-plugin-wc)
- [eslint-plugin-lit](https://www.npmjs.com/package/eslint-plugin-lit)
- [eslint-plugin-html](https://www.npmjs.com/package/eslint-plugin-html)
- [eslint-plugin-mocha-no-only](https://www.npmjs.com/package/eslint-plugin-mocha-no-only)

## Setup

### Automated

For an automated setup, use our [project generator](../developing-components/getting-started.md) and choose the linting option.

### Manual

To set up our config manually, install the necessary packages:

```bash
npm install --save-dev eslint @open-wc/eslint-config prettier eslint-config-prettier
```

And update your package.json with the commands and config:

```json
{
  "scripts": {
    "lint": "npm run lint:eslint && npm run lint:prettier",
    "format": "npm run format:eslint && npm run format:prettier",
    "lint:eslint": "eslint --ext .js,.html . --ignore-path .gitignore",
    "format:eslint": "eslint --ext .js,.html . --fix --ignore-path .gitignore",
    "lint:prettier": "prettier \"**/*.js\" --check --ignore-path .gitignore",
    "format:prettier": "prettier \"**/*.js\" --write --ignore-path .gitignore"
  },
  "eslintConfig": {
    "extends": ["@open-wc/eslint-config"]
  },
  "prettier": {
    "singleQuote": true,
    "arrowParens": "avoid"
  }
}
```

## IDE Support

Most IDEs have plugins or configuration options available to help with code linting and formatting.

For VSCode we recommend the [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) plugin for highlighting linting errors, and the [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for formatting on save.

https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

## Lint on commit

To lint changed files on commit, we recommend [husky](https://www.npmjs.com/package/husky) with [lint-staged](https://www.npmjs.com/package/lint-staged).

Install the necessary packages:

```
npm install --save-dev husky lint-staged
```

And update your package.json:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write", "git add"]
  }
}
```
