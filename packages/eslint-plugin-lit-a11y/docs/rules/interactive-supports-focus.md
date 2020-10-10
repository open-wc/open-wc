# Elements with an interactive role and interaction handlers (mouse or key press) must be focusable. (interactive-supports-focus)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
// Bad: span with @click attribute has no tabindex
html`
  <span @click="${submitForm()}" role="button">Submit</span>
`;
// Bad: anchor element without href is not focusable
html`
  <a @click="${showNextPage()}" role="button">Next page</a>
`;
```

Examples of **correct** code for this rule:

```js
// Good: div with @click attribute is hidden from screen reader
html`
  <div aria-hidden @click=${() => void 0} />
`;
// Good: span with @click attribute is in the tab order
html`
  <span @click="${doSomething()}" tabIndex="0" role="button">Click me!</span>
`;
// Good: span with @click attribute may be focused programmatically
html`
  <span @click="${doSomething()}" tabIndex="-1" role="menuitem">Click me too!</span>
`;
// Good: anchor element with href is inherently focusable
html`
  <a href="javascript:void(0);" @click="${doSomething()}">Click ALL the things!</a>
`;
// Good: buttons are inherently focusable
html`
  <button @click="${doSomething()}">Click the button :)</button>
`;
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
