# alt-text

Enforce that all elements that require alternative text have meaningful information to relay back to the end user. This is a critical component of accessibility for screen reader users in order for them to understand the content's purpose on the page. By default, this rule checks for alternative text on `<img>` elements.

## Rule Details

Examples of **incorrect** code for this rule:

```js
html`
  <img src="${src}" />
`;
```

Examples of **correct** code for this rule:

```js
html`
  <img src="${src}" alt="" />
`;
```

```js
html`
  <img src="${src}" alt="foo" />
`;
```

## Further Reading

- [WCAG 1.1.1](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
- [axe-core, object-alt](https://dequeuniversity.com/rules/axe/3.2/object-alt)
- [axe-core, image-alt](https://dequeuniversity.com/rules/axe/3.2/image-alt)
- [axe-core, input-image-alt](https://dequeuniversity.com/rules/axe/3.2/input-image-alt)
- [axe-core, area-alt](https://dequeuniversity.com/rules/axe/3.2/area-alt)
