# heading-has-content

Enforce that heading elements (`h1`, `h2`, etc.) have content and that the content is accessible to screen readers. Accessible means that it is not hidden using the `aria-hidden` attribute. Refer to the references to learn about why this is important.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
html`
  <h1>
    <div aria-hidden="true">foo</div>
  </h1>
`;
```

```js
html` <h1></h1> `;
```

Examples of **correct** code for this rule:

```js
html` <h1>Foo</h1> `;
```

```js
html`
  <h1>
    <div aria-hidden="true">foo</div>
    foo
  </h1>
`;
```

## Further Reading

- [WCAG 2.4.6](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)
- [axe-core, empty-heading](https://dequeuniversity.com/rules/axe/3.2/empty-heading)
