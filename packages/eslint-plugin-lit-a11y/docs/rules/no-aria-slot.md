# no-aria-slot

## Rule Details

Ensure aria- and role attributes aren't present on `<slot>` elements. While neither obvious nor clearly documented, these attributes aren't permitted on slots and cause problems for some assistive devices and accessibility checkers.

Examples of **incorrect** code for this rule:

```js
html` <slot name="test" aria-label="test" role="button"></slot> `;
```

Examples of **correct** code for this rule:

```js
html`
  <div role="button" aria-label="test">
    <slot></slot>
  </div>
`;
```

## Further Reading

- [ARIA in HTML conformance requirements](https://www.w3.org/TR/html-aria/#el-slot)
- [ARIA in HTML test cases](https://w3c.github.io/html-aria/tests/slot.html)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot#technical_summary)
