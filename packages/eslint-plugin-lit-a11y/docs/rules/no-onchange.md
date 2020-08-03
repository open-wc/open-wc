# Enforce usage of onBlur over onChange for accessibility. (no-onchange)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`<select @change=${foo}></select>`;
html`<option @change=${foo}></option>`;
```

Examples of **correct** code for this rule:

```js
html`<select @blur=${foo}></select>`;
html`<div></div>`;
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
