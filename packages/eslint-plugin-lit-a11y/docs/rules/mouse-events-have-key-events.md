# mouse-events-have-key-events

Enforce `@mouseover`/`@mouseout` are accompanied by `@focus`/`@blur`. Coding for the keyboard is important for users with physical disabilities who cannot use a mouse, AT compatibility, and screenreader users.

## Rule Details

Examples of **incorrect** code for this rule:

```js
html`
  <button @mouseout="${onMouseout}"></button>
`;
```

```js
html`
  <button @mouseover="${onMouseover}"></button>
`;
```

Examples of **correct** code for this rule:

```js
html`
  <button @mouseout="${onMouseout}" @blur="${onBlur}"></button>
`;
```

```js
html`
  <button @mouseover="${onMouseover}" @blur="${onBlur}"></button>
`;
```

## Further Reading

- [WCAG 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)
