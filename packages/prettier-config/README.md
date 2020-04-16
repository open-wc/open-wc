# Linting Prettier

Use [Prettier](https://prettier.io) to format your JS, CSS and HTML code.

> :Warning: this package is deprecated. We recommend using prettier v2 with the recommend config instead.

## Setup

```bash
npm init @open-wc
# Upgrade > Linting
```

## Manual

- Install `@open-wc/prettier-config`
  ```bash
  npm add --save-dev @open-wc/prettier-config
  ```
- Adjust your package.json with the following
  ```js
  "scripts": {
    "lint:prettier": "prettier \"**/*.js\" --check --ignore-path .gitignore",
    "format:prettier": "prettier \"**/*.js\" --write --ignore-path .gitignore"
  },
  "devDependencies": {
    "@open-wc/prettier-config": "^0.1.10"
  },
  "eslintConfig": {
    "extends": [
      "eslint-config-prettier"
    ]
  },
  "prettier": "@open-wc/prettier-config"
  ```

## What you get

- Apply formatting to JS files
- Apply formatting to HTML inside of `html` tagged template literals used by [lit-html](https://github.com/Polymer/lit-html)
- Apply formatting to CSS inside of `css` tagged template literals used by [lit-element](https://lit-element.polymer-project.org/guide/styles#static-styles)
- Integration with ESLint to prevent potentially conflicting rules

## Usage

Run:

- `npm run lint:prettier` to check if your files are correctly formatted
- `npm run format:prettier` to auto format your files

## Linting Error Examples

```bash
$ npm run lint:prettier

test/set-card.test.js
test/set-game.test.js
↑↑ these files are not prettier formatted ↑↑
```

Simply run `npm run format:prettier` to format your files automatically.

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/prettier-config/README.md';
      }
    }
  }
</script>
