# Certain reserved DOM elements do not support ARIA roles, states and properties. (aria-unsupported-elements)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`
  <meta charset="UTF-8" aria-hidden="false" />
`;
html`
  <script role="foo"></script>
`;
html`
  <style aria-hidden="foo"></style>
`;
html`
  <style role="foo" aria-hidden="foo"></style>
`;
```

Examples of **correct** code for this rule:

```js
html`
  <script src="./foo.js"></script>
`;
html`
  <meta charset="UTF-8" />
`;
html`
  <style></style>
`;
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
