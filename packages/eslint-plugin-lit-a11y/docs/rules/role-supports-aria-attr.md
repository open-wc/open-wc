# Enforce that elements with a defined role contain only supported ARIA attributes for that role. (role-supports-aria-attr)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`<li aria-required role="radio" aria-checked="false">Rainbow Trout</li>`;
html`<div role="combobox" aria-checked="true"></div>`;
```

Examples of **correct** code for this rule:

```js
html`<div role="checkbox" aria-checked="true"></div>`;
html`<div role="presentation"></div>`;
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
