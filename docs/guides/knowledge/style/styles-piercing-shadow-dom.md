# Knowledge >> Style >> Styles Piercing Shadow DOM ||30

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

```js script
import '@d4kmor/launch/inline-notification/inline-notification.js';
```

<inline-notification type="warning">

Do note that setting `all: initial;` will also reset any CSS custom properties, which you'll usually _want_ to maintain. If you find yourself going this route, it's worth considering if you need an iframe instead.

</inline-notification>

You can find a code example [here](https://webcomponents.dev/edit/NeHSCFaBjUkpe5ldUu1N).

If you're interested in reading more about this, you can check out these resources:

- [Why is my web component inheriting styles?](https://lamplightdev.com/blog/2019/03/26/why-is-my-web-component-inheriting-styles/)
- [Web Fundamentals: Web Components](https://developers.google.com/web/fundamentals/web-components/shadowdom#reset)
