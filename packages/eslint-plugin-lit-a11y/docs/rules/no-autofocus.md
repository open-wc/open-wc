# no-autofocus

Enforce that autofocus attribute is not used on elements. Autofocusing elements can cause usability issues for sighted and non-sighted users, alike.

## Rule Details

Examples of **incorrect** code for this rule:

```js
html`
  <div autofocus></div>
`;
html`
  <div autofocus="true"></div>
`;
html`
  <div autofocus="false"></div>
`;
html`
  <div autofocus=${foo}></div>
`;
```

Examples of **correct** code for this rule:

```js
html`
  <div></div>
`;
```

### Resources

- [WHATWG HTML Standard, The autofocus attribute](https://html.spec.whatwg.org/multipage/interaction.html#attr-fe-autofocus)
- [The accessibility of HTML 5 autofocus](https://www.brucelawson.co.uk/2009/the-accessibility-of-html-5-autofocus/)
