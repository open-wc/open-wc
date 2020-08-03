# Enforce that autoFocus prop is not used on elements. (no-autofocus)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`<div autofocus></div>`;
html`<div autofocus="true"></div>`;
html`<div autofocus="false"></div>`;
html`<div autofocus=${foo}></div>`;
```

Examples of **correct** code for this rule:

```js
html`<div></div>`;
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
