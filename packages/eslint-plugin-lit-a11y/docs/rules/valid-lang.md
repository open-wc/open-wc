# valid-lang

Enforce the `lang` attribute on the `html` element.
The `lang` attribute will only be populated with a value that's [BCP 47](https://www.ietf.org/rfc/bcp/bcp47.txt) compliant

## Rule Details

This rule aims to ensure HTML content is [WCAG 3.1.1 compliant](https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-doc-lang-id.html).

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
