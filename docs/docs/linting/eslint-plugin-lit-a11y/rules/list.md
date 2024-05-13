# list

`<ul>` and `<ol>` must only directly contain `<li>`, `<script>` or `<template>` elements.

## Rule Details

Examples of **incorrect** code for this rule:

```js
html` 
<ul>
  <div></div>
  <li></li>
</ul
`;
```

Examples of **correct** code for this rule:

```js
html` 
<ul>
  <li></li>
</ul
`;
```

```js
html` 
<ul>
  <li>
    <ul>
      <li></li>
    </ul>
  </li>
</ul
`;
```

```js
html` 
<ol>
  <li></li>
</ol
`;
```

## Further Reading

- [Deque](https://dequeuniversity.com/rules/axe/4.6/list)
