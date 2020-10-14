# eslint-plugin-lit-a11y

Accessibility linting plugin for lit-html.

Most of the rules are ported from [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y).

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-lit-a11y`:

```
$ npm install eslint-plugin-lit-a11y --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-lit-a11y` globally.

## Usage

Add `lit-a11y` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["lit-a11y"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "lit-a11y/rule-name": 2
  }
}
```

## Configuration

You may also extend the recommended configuration like so:

```json
{
  "extends": ["plugin:lit-ally/recommended"]
}
```

## Supported Rules

- Fill in provided rules here
