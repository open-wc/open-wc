# heading-hidden

Headings must not be hidden from screenreaders

## Rule Details

Examples of **incorrect** code for this rule:

```js
html` 
<h1 aria-hidden="true>hello</h1>
`;
```

Examples of **correct** code for this rule:

```js
html` <h1>hello</h1> `;
```

## Further Reading

- [Deque](https://dequeuniversity.com/rules/axe/4.6/empty-heading)
