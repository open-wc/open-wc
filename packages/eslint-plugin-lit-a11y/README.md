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

## Supported Rules

- Fill in provided rules here

## Contributing

### Getting up and running

Run:

```bash
npm install
```

#### Adding a new rule

Make sure to have yeoman installed, and the eslint generator.

```bash
npm i -g yo generator-eslint
```

Add a new rule by running:

```bash
yo eslint:rule
```

#### Implementing a new rule

Implementing rules is made possible by the TemplateAnalyzer from [eslint-plugin-lit](https://www.npmjs.com/package/eslint-plugin-lit). You can take the implementations of [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) as an example.

Here's an example of a simple rule:

```js
return {
  TaggedTemplateExpression: node => {
    // 1. only target html`` tagged template literals
    if (
      node.type === 'TaggedTemplateExpression' &&
      node.tag.type === 'Identifier' &&
      node.tag.name === 'html'
    ) {
      // 2. create a TemplateAnalyzer and pass it the node
      const analyzer = TemplateAnalyzer.create(node);

      // 3. traverse DOM elements in the html tagged template literal
      analyzer.traverse({
        enterElement: element => {
          // 4. implement rule
          if ('autofocus' in element.attribs) {
            const loc = analyzer.getLocationForAttribute(element, 'autofocus');
            context.report({
              loc,
              message: 'Enforce that autofocus attribute is not used on elements.',
            });
          }
        },
      });
    }
  },
};
```

#### Testing a rule

In order to test a rule, you need to pass some options to the `RuleTester` to be able to support tagged template literals.

```js
var ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
```
