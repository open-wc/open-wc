# Enforce tabIndex value is not greater than zero. (tabindex-no-positive)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`<div tabindex="1"></div>`;
html`<div tabindex="2"></div>`;
html`<div tabindex="foo"></div>`;
```

Examples of **correct** code for this rule:

```js
html`<div tabindex="0"></div>`;
html`<div tabindex="-1"></div>`;
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
