# Enforce that elements with ARIA roles must have all required attributes for that role. (role-has-required-aria-attrs)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`<span role="checkbox"></span>`;
html`<div role="combobox"></div>`;
html`<div role="slider"></div>`;
```

Examples of **correct** code for this rule:

```js
html`<span role="alert" aria-atomic="foo" aria-live="foo"></span>`;
html`<span role="checkbox" aria-checked="false" aria-labelledby="foo" tabindex="0"></span>`;
html`<span role="row"></span>`;
html`<input type="checkbox" role="switch" aria-checked="true" />`;
html`<div role="combobox" aria-controls="foo" aria-expanded="foo"></div>`;
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
