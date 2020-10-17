# Elements with an interactive role and interaction handlers (mouse or key press) must be focusable. (interactive-supports-focus)

## How do I resolve this error?

### Case: I got the error "Elements with the '\${role}' interactive role must be tabbable". How can I fix this?

This element is a stand-alone control like a button, a link or a form element. A user should be able to reach this element by pressing the tab key on their keyboard.

Add the `tabindex` property to your component. A value of zero indicates that this element can be tabbed to.

```js
html` <div role="button" tabindex=${0} /> `;
```

-- or --

Replace the component with one that renders semantic html element like `<button>`, `<a href>` or `<input>` -- whichever fits your purpose.

Generally buttons, links and form elements should be reachable via tab key presses. An element that can be tabbed to is said to be in the _tab ring_.

### Case: I got the error "Elements with the '\${role}' interactive role must be focusable". How can I fix this?

This element is part of a group of buttons, links, menu items, etc. Or this element is part of a composite widget. Composite widgets prescribe standard [keyboard interaction patterns](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_generalnav). Within a group of similar elements -- like a button bar -- or within a composite widget, elements that can be focused are given a tabindex of -1. This makes the element _focusable_ but not _tabbable_. Generally one item in a group should have a tabindex of zero so that a user can tab to the component. Once an element in the component has focus, your key management behaviors will control traversal within the component's pieces. As the UI author, you will need to implement the key handling behaviors such as listening for traversal key (up/down/left/right) presses and moving the page focus between the focusable elements in your widget.

```js
html`
  <div role="menu">
    <div role="menuitem" tabindex="0">Open</div>
    <div role="menuitem" tabindex="-1">Save</div>
    <div role="menuitem" tabindex="-1">Close</div>
  </div>
`;
```

In the example above, the first item in the group can be tabbed to. The developer provides the ability to traverse to the subsequent items via the up/down/left/right arrow keys. Traversing via arrow keys is not provided by the browser or the assistive technology. See [Fundamental Keyboard Navigation Conventions](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_generalnav) for information about established traversal behaviors for various UI widgets.

### Case: This element is not a button, link, menuitem, etc. It is catching bubbled events from elements that it contains

If your element is catching bubbled click or key events from descendant elements, then the proper role for this element is `presentation`.

```js
html`
  <div @click=${onClickHandler} role="presentation">
    <button>Save</button>
  </div>
`;
```

Marking an element with the role `presentation` indicates to assistive technology that this element should be ignored; it exists to support the web application and is not meant for humans to interact with directly.

## Rule details

This rule takes an options object with the key `tabbable`. The value is an array of interactive ARIA roles that should be considered tabbable, not just focusable. Any interactive role not included in this list will be flagged as needing to be focusable (tabindex of -1).

```js
{
  'lit-a11y/interactive-supports-focus': [
    'error',
    {
      tabbable: [
        'button',
        'checkbox',
        'link',
        'searchbox',
        'spinbutton',
        'switch',
        'textbox',
      ],
    },
  ]
}
```

The recommended options list interactive roles that act as form elements. Generally, elements with a role like `menuitem` are a part of a composite widget. Focus in a composite widget is controlled and moved programmatically to satisfy the prescribed [keyboard interaction pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_generalnav) for the widget.

The list of possible values includes:

```js
[
  'button',
  'checkbox',
  'columnheader',
  'combobox',
  'grid',
  'gridcell',
  'link',
  'listbox',
  'menu',
  'menubar',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'progressbar',
  'radio',
  'radiogroup',
  'row',
  'rowheader',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'tablist',
  'textbox',
  'toolbar',
  'tree',
  'treegrid',
  'treeitem',
  'doc-backlink',
  'doc-biblioref',
  'doc-glossref',
  'doc-noteref',
];
```

Examples of **incorrect** code for this rule:

```js
// Bad: span with @click attribute has no tabindex
html` <span @click="${submitForm()}" role="button">Submit</span> `;
// Bad: anchor element without href is not focusable
html` <a @click="${showNextPage()}" role="button">Next page</a> `;
```

Examples of **correct** code for this rule:

```js
// Good: div with @click attribute is hidden from screen reader
html` <div aria-hidden @click=${() => void 0} /> `;
// Good: span with @click attribute is in the tab order
html` <span @click="${doSomething()}" tabIndex="0" role="button">Click me!</span> `;
// Good: span with @click attribute may be focused programmatically
html` <span @click="${doSomething()}" tabIndex="-1" role="menuitem">Click me too!</span> `;
// Good: anchor element with href is inherently focusable
html` <a href="javascript:void(0);" @click="${doSomething()}">Click ALL the things!</a> `;
// Good: buttons are inherently focusable
html` <button @click="${doSomething()}">Click the button :)</button> `;
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

## Accessibility guidelines

- [WCAG 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

### Resources

- [Chrome Audit Rules, AX_FOCUS_02](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_02)
- [Mozilla Developer Network - ARIA Techniques](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role#Keyboard_and_focus)
- [Fundamental Keyboard Navigation Conventions](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_generalnav)
- [WAI-ARIA Authoring Practices Guide - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex)
