# definition-list

`<dl>` elements must only directly contain properly-ordered `<dt>` and `<dd>` groups, `<script>`, `<template>` or `<div>` elements

## Rule Details

Examples of **incorrect** code for this rule:

```js
html`
  <dl>
    <p></p>
    <dt>Milk</dt>
    <dd>White cold drink</dd>
  </dl>
`;
```

Examples of **correct** code for this rule:

```js
html`
  <dl>
    <dt>Coffee</dt>
    <dd>Black hot drink</dd>
    <div>
      <dt>Milk</dt>
      <dd>White cold drink</dd>
    </div>
  </dl>
`;
```

## Further Reading

- [Deque](https://dequeuniversity.com/rules/axe/4.6/definition-list)
