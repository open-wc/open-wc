# Setup >> Linting ||40

> This text is not yet written or polished - care to help?

Use [ESLint](https://eslint.org/) to lint your code.

## Setup

```bash
npm init @open-wc
# Upgrade > Linting
```

## Manual

- Install `@open-wc/eslint-config`
  ```bash
  npm add --save-dev @open-wc/eslint-config
  ```
- Adjust your package.json with the following
  ```js
  {
    "scripts": {
      "lint:eslint": "eslint --ext .js,.html . --ignore-path .gitignore",
      "format:eslint": "eslint --ext .js,.html . --fix --ignore-path .gitignore"
    },
    "eslintConfig": {
      "extends": [
        "@open-wc/eslint-config"
      ]
    }
  }
  ```

## What you get

This will install [`@open-wc/eslint-config`](https://github.com/open-wc/open-wc/blob/master/packages/eslint-config/index.js), a config based on airbnb but allows for some specialities needed for Web Components.

- Apply linting to js and html files
- Apply linting for best practices
- Allow dynamic module imports
- Allow imports in test/demos from devDependencies
- Allow underscore dangle
- Do not prefer default exports
- Do not prefer no file extension

## Usage

Run:

- `npm run lint:eslint` to check if any file is not correctly formatted
- `npm run format:eslint` to auto format your files

## Running with Prettier

If you also are using Prettier, in order for your ESLint to play nicely with Prettier, you should also include eslint-config-prettier.
This way, the Prettier formatting will take into account your linting rules, so you don't need to add your own overrides for Prettier if it clashes with your linting rules.

```bash
npm add --save-dev eslint-config-prettier
```

```json
{
  "eslintConfig": {
    "extends": ["@open-wc/eslint-config", "eslint-config-prettier"]
  }
}
```

And if you want the same formatting rules as the deprecated `@open-wc/prettier-config`, you can add some prettier overrides in your `package.json`:

```json
{
  "prettier": {
    "singleQuote": true,
    "arrowParens": "avoid"
  }
}
```

This combination of `Prettier 2` and `@open-wc/eslint-config` represents the outcome if you add both linting and formatting while scaffolding with:

```bash
npm init @open-wc
```
