---
permalink: 'linting/index.html'
title: Linting
section: guides
tags:
  - guides
---

# Linting

Linting can help you write consistent code, and easily prevent mistakes. Open-wc recommends the following tools:

We recommend

- [ESLint](https://eslint.org/) to lint your es6 code
- [Prettier](https://prettier.io/) to auto format your code (The Prettier extension for VSCode is also helpful)
- [lint-staged](https://www.npmjs.com/package/lint-staged) to apply linting fixed only to changed files

## Automated Setup

You can use our scaffoldint to set up a new project, or upgrade an existing project.

```bash
npm init @open-wc
```

## Manual Setup

Install needed dependencies:

```bash
npm add --save-dev @open-wc/eslint-config prettier lint-staged husky
```

Adjust your package.json with the following:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write", "git add"]
  },
  "scripts": {
    "lint:eslint": "eslint --ext .js,.html . --ignore-path .gitignore",
    "format:eslint": "eslint --ext .js,.html . --fix --ignore-path .gitignore",
    "lint:prettier": "prettier \"**/*.js\" --check --ignore-path .gitignore",
    "format:prettier": "prettier \"**/*.js\" --write --ignore-path .gitignore",
    "lint": "npm run lint:eslint && npm run lint:prettier",
    "format": "npm run format:eslint && npm run format:prettier"
  },
  "devDependencies": {
    "eslint": "^6.1.0",
    "@open-wc/eslint-config": "^2.0.0",
    "prettier": "^2.0.4",
    "husky": "^1.0.0",
    "lint-staged": "^10.0.0"
  }
}
```

## Usage

Run:

- `npm run lint` to check if any file is correctly formatted
- `npm run format` to auto format your files

Whenever you create a commit the update files will be auto formatted and the commit message will be linted for you.

To format on save in VSCode, first enable the Prettier extension, then within your VSCode settings, check the **Editor: Format on Save** option.
