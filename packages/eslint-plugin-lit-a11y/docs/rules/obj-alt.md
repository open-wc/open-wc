# obj-alt

Ensures that every object element has a text alternative

## Rule Details

Examples of **incorrect** code for this rule:

```js
html`
  <object data="path/to/content"></object>
  <object data="path/to/content"><div></div></object>
  <object data="path/to/content">This object has no alternative text.</object>
`;
```

Examples of **correct** code for this rule:

```js
html`
  <object data="path/to/content" title="This object has text"></object>
  <object data="path/to/content" aria-label="this object has text"></object>
  <span id="label1">this object has text</span>
  <object data="path/to/content" aria-labelledby="label1"></object>
  <object data="path/to/content" role="presentation"></object>
  <object data="path/to/content" role="none"></object>
`;
```

## Further Reading

- [Deque obj-alt](https://dequeuniversity.com/rules/axe/4.6/object-alt)
