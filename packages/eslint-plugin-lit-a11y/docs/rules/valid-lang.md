# valid-lang

Enforce the `lang` attribute on the `html` element.
The `lang` attribute will only be populated with a value that's a [BCP 47](https://www.ietf.org/rfc/bcp/bcp47.txt) compliant

## Rule Details

This rule aims to prevent degradation of keyboard accessibility for keyboard-focusable elements.

Examples of **incorrect** code for this rule:

```js
html` <html></html> `;
```

```js
html` <html lang="not-a-real-language"></html> `;
```

Examples of **correct** code for this rule:

```js
html` <html lang="en"></html> `;
```

## Further Reading

[MDN: lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
