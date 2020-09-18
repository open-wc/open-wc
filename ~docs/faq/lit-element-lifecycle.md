---
permalink: 'faq/lit-element-lifecycle.html'
title: LitElement lifecycle
section: faq
tags:
  - faq
---

# LitElement lifecycle

## Overview

Below is an overview of the most useful lifecycle callbacks. Check out the [official documentation](https://lit-element.polymer-project.org/guide/lifecycle) for a full overview.

```js
class MyElement extends LitElement {
  /**
   * Called once in the lifetime of an element, when it is instantiated.
   * Useful for one-time synchronous setup work. You do not have access to
   * any DOM in the constructor.
   *
   * You should not perform any side effects here, because someone might
   * create your element without ever appending it to the DOM. Registering
   * event listeners on your own element is fine.
   */
  constructor() {
    super();
  }

  /**
   * Called when the element is added to the page, useful for setup work which
   * requires access to the DOM. However, your element has not done it's initial
   * render here yet.
   *
   * Can be called multiple times when your element is moved around on the page,
   * for example when using drag & drop.
   *
   * You might need to make sure your setup work runs only once, or you can clean
   * it up in the disconnectedCallback.
   *
   * Because LitElement does some work in the connectedCallback, you must always
   * call super.connectedCallback. This one is easy to miss!
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Called when the element is removed from the page. Useful for cleaning up work
   * done in connectedCallback.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * Called when an update was triggered, before rendering. Receives a Map of changed
   * properties, and their previous values. This can be used for modifying or setting
   * new properties before a render occurs.
   */
  update(changed) {
    super.update();
  }

  /**
   * Called when an update was triggered, after rendering. Receives a Map of changed
   * properties, and their previous values. This can be used for observing and acting
   * on property changes.
   */
  updated(changed) {
    super.updated(changed);
  }

  /**
   * Called when your element has rendered for the first time. Called once in the
   * lifetime of an element. Useful for one-time setup work that requires access to
   * the DOM.
   */
  firstUpdated() {
    super.firstUpdated();
  }
}
```

### Lifecycle sequence

#### First update:

constructor -> connectedCallback -> update -> render -> updated -> firstUpdated

#### Subsequent renders:

update -> render -> updated
