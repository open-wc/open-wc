# Component >> Knowledge >> Styles Piercing Shadow DOM ||30

> This text is not yet written or polished - care to help?

> "Doesn't shadow DOM provide total encapsulation?"

Nope! As written in the [spec](https://www.w3.org/TR/css-scoping-1/#inheritance):

> The top-level elements of a shadow tree inherit from their host element.

What this means is that [_inheritable_](https://gist.github.com/dcneiner/1137601) styles, like `color` or `font-family` among others, continue to inherit in shadow DOM, will _pierce_ the shadow DOM and affect your component's styling.

Custom CSS properties are also able to pierce the shadow DOM boundary, and can be used to style elements from outside of your component itself. Example:

```css
/* define: */
html {
  --owc-blue: #217ff9;
}

/* use inside your component: */
:host {
  background-color: var(--owc-blue);
}
```

If this inheriting behavior is undesirable, you can reset it by adding the following CSS to your component:

```css
:host {
  /* Reset specific CSS properties */
  color: initial;

  /* Reset all CSS properties */
  all: initial;
}
```

<div class="custom-block warning"><p class="custom-block-title">WARNING</p> <p>Do note that setting <code>all: initial;</code> will also reset any CSS custom properties, which you'll usually <em>want</em> to maintain. If you find yourself going this route, it's worth considering if you need an iframe instead.</p></div>

You can find a code example [here](https://webcomponents.dev/edit/NeHSCFaBjUkpe5ldUu1N).

If you're interested in reading more about this, you can check out these resources:

- [Why is my web component inheriting styles?](https://lamplightdev.com/blog/2019/03/26/why-is-my-web-component-inheriting-styles/)
- [Web Fundamentals: Web Components](https://developers.google.com/web/fundamentals/web-components/shadowdom#reset)
