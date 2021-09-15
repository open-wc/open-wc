---
title: 'Some things to know when developing with LitElement'
pageTitle: 'Some things to know when developing with LitElement'
date: 2021-09-13
published: true
description: 'When comparing tooling opportunities it can be valuable to understand both sides in their native context before calling one better than the other.'
tags: [litelement, webcomponents, typescript, learning]
canonical_url: https://open-wc.org/blog/some-things-to-know-when-developing-with-lit-element/
cover_image: /blog/some-things-to-know-when-developing-with-lit-element/images/blog-header.jpg
socialMediaImage: /blog/some-things-to-know-when-developing-with-lit-element/images/social-media-image.jpg
---

When reviewing software with which you have little experience, it's pretty common to attempt to compare it to software you have used before. That can help you get a handle on the general ergonomics and decisions behind the two pieces of software in question. However, one thing that this approach is not particularly good at is comparing the new software _in situ_. You may have spent a good amount of time investigating, researching, and getting comfortable with the software you're already using in the context of your particular use casso much so, that it may even be the best solution available in that context. Comparing a new software in that context (unless it, too, is purpose-built for that context) can do a disservice to the software under test, as well as to your ability to fully understand the benefits of that software.

This is what I keep coming back to when people say things like "X isn't as good as Y" when "X" is a way to build web components ([of which there are many](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/)) and "Y" is a JS framework. Even before you fill actual names into either side of the equation the differences in usage of what you fill those in with is important:

- JS frameworks often want to own most or all of a page, whereas a web component is a single custom element on an potentially large and diverse DOM tree.
- Functional JS frameworks often hide much of that ownership from view to both the benefit (less code) and expense (less flexibility) of developers leveraging them.
- JS Frameworks tend to be an abstraction above the DOM and in this way, their "components" can exist as both literal (DOM/UI elements) and figurative (data connectivity/translations to non-web contexts).
- Web components being a DOM element can interact with their position in the DOM in the ways you'd otherwise need to bend over backward to do in a framework.
- JS frameworks often ship a lot of JS down the wire that may not be required by your application or component(s) whether or not the framework author gives you the ability to manage how much of that code makes it into your production build.
- Since web components are DOM elements, they can use their position in the DOM in ways you'd need to bend over backward to do in some JS frameworks.
- Web components are portable to just about any context in which you'd build web UI, while JS frameworks require your components to run in an app built with the same framework (unless or course, they allow you to export web components).
- and, many, many more.

Some or all of these points could be seen as being for or against either side of the conversation. Many of these could switch from pro to con depending on the particular use case. Too often, reviews that fail to take that into account lead to half-baked, often hypercritical takes.

With that in mind, I want to go over some concepts that support healthier decision-making when teams evaluate LitElement for their projects. This isn't really a "how-to", though I've got some (slightly) dated version of that available in my ["Not Another To-Do App" series](https://dev.to/westbrook/not-another-to-do-app-2kj9). This is more of a "good to know" guide, as these concepts aren't all exact ports from JS framework contexts. I hope the ability to judge the differences from a place of knowledge proves useful to you.

---

## Default Values

There are a number of ways to define default values for a property on a LitElement, While some do require management across the entire element class, we'll ignore those today as there are a number of options that do not require such work.

First off, LitElement's `render()` method of a LitElement is (from the user's perspective) an almost 1 to 1 conversion from the functional definitions found in other offerings. In this way, you could treat `render()` as the only entry into your properties and define fallbacks at the top of your render function's body like so:

```js
render() {
  const closeDelay = this.closeDelay ?? 300;
  return html`<x-dialog delay=${closeDelay}>Thank you!</x-dialog>`;
}
```

From here, you could get very close to simply copy and paste the rest of a functional UI component into a LitElement for an early test of its capabilities. Leveraging scoped variables like this, rather than class properties, does leave you in much the same place that functional alternatives to UI development do; needing additional tools for memoization of that scope. As using LitElement means you're already in a class context, we can use the capabilities of a class directly rather than synthesizing them with memoization.

A simpler approach to merging the two concepts is to set that fallback into the class property itself. Above I showed doing this in the `render()` lifecycle method, however, I find it much nicer to _only_ have the template surfaced therein. Leveraging one of the earlier lifecycle methods for managing defaults, validation, sanitation, transformation, or derivation help to maintain that structure. In this case, we'll use `willUpdate()` which doesn't require a `super` call or a returned value, but will always be visited during each render lifecycle:

```js
willUpdate(changedProperties: PropertyValues<this>): void {
  this.closeDelay = this.closeDelay ?? 300;
}
```

With this approach, you can most closely facilitate the single line defaulting that can be present when relying on a function to define a component. This does mean the `shouldRender()` method - the first method called in the render lifecycle - will not have your default value, and if that's an issue for your style of element development, you might want to move this fallback work there, but it also means that due to the fact the LitElement renders asynchronously there's technically a possibility that your local methods could as well. Due to this fact, you may want to leverage a slightly more complete approach to a default.

Here we see the property getter fallback to the value:

```js
get closeDelay(): number {
  return this._closeDelay || 300;
}
set closeDelay(value: number) {
  const closeDelay = value;
  if (closeDelay === this.closeDelay) return;
  this.requestUpdate('closeDelay', this.closeDelay);
  this._closeDelay = closeDelay;
}
_closeDelay = 300;
```

This does eclipse the simplicity of a functional solution as we are choosing to apply the default by writing our own getter/setter pair on the property. At the same time, however, we've fallen into a possible trap of the functional fallback approach (and as the `willUpdate()` approach above), we're allowing our entire render lifecycle to be triggered for what might not be an actual change to our component state. Were `this.closeDelay` to already equal `300` and the application to change it to `undefined`, all of these approaches we've looked at so far would cause whatever could occur in your render lifecycle to occur needlessly.

By falling back in the setter as opposed to the getter you can leverage the capabilities of a class component to prevent the render lifecycle to be started altogether. In the following code, no matter how the value of `this.closeDelay` gets to `300` the call to `this.requestUpdate()` is gated as long as the final value doesn't change.

```js
class MyThing extends LitElement {
  @property({type: Number})
  get closeDelay(): number {
    return this._closeDelay;
  }
  set closeDelay(value: number) {
    const closeDelay = value ?? 300;
    if (closeDelay === this.closeDelay) return;
    this.requestUpdate('closeDelay', this.closeDelay);
    this._closeDelay = closeDelay;
  }
  _closeDelay = 300;
...
```

Here you may still ask, "but, why it is so much more code?" and, in our ecosystem of "less is more", both from a DX as well as a UX/performance standpoint, it's a great question. It's more code because it is also a different level/type of capability. Here we get a default to our property, clear gating on the render lifecycle, and on top of that, we get a value that is held state-fully within a class that defines a DOM element. This means that not only can it take part in the render pipeline of the element that owns it, but that it is available for other elements that share its DOM tree to query as a container for that state. Not every application is architected with a want or need for this capability. Not every component is going to be leveraged at the scale where the checking is needed to confirm that the render lifecycle has no side effects in a way that benefits extra prevention of the lifecycle altogether. However, when you do, you might take a look at LitElement as a path towards attaining these capabilities.

## So you like Typescript?

Typescript loves a good `"Property is not definitely assigned in the constructor"` warning, and if you like Typescript enough to use it a lot, you'll likely run into it at some point. It's telling you this, because in contrast to what you've been told Typescript is NOT smarter than you and it can't tell if something _should_ always be available, only if it _might_ not be available. You can set an initial value to a property, and it'll never yell:

```js
class MyThing extends LitElement {
  myProperty = 'string'; // always available, always a string
}
```

If you're looking for that to _have_ to be initialized to use your element, so _you_ KNOW it's going to always have a value, but you want the consumer to initialize it, then you can tell Typescript that by using the `!` operator once and be done with it:

```js
class MyThing extends LitElement {
  myProperty!: string; // no initial value, but a string is required from the consumer
}
```

If you still want to be defensive, you can add some helper code in your lifecycle to support a consumer leveraging your custom element correctly:

```js
class MyThing extends LitElement {
  shouldUpdate(changedProperties: PropertyValues<this>): boolean {
    // great location to make sure it's NEVER undefined;
    const canUpdate = this.myProperty ?? false;
    if (!canUpdate) console.warn('`myProperty` is unset');
    return canUpdate && super.shouldUpdate(changedProperties);
  }
  firstUpdated(changedProperties: PropertyValues<this>): void {
    // for one time availability confirmation
    super.firstUpdated(changedProperties);
    if (!this.myProperty) console.warn('`myProperty` is unset');
  }
}
```

### Required properties

In this way, you can also manage required properties/attributes. No, it doesn't fall within the available management of a tool-based contract with the consumers of your component, however, a tool-based contract is not strictly enforceable. You as a component author can tell Typescript or a linter to error on certain things, but your consumer can tell them not to just as easily. Deciding to _only_ leverage tooling for this sort of capability might mean less work for you, but it doesn't guarantee better outcomes for your consumers. Any component author will need to decide the risks they are willing to foist onto their consumers when publishing a component, and this is yet another item to manage on that list.

## Event management

Event listeners added directly on `this` in a custom element _do not_ need to be cleaned up when disconnected from the `document`. Once all references to the element are released, the same garbage collection that cleans up the element itself will clean up the events bound to it. What's more, when calling `addEventListener` on `this`, the method's `this` reference automatically reverts to the instance. You don't need to bind the method, so you can call a class method directly without any `.bind(this)` or class field arrow-functions.

```js
@customElement('menu-trigger')
export class MenuTrigger extends LitElement {
  @property({type: String})
  trigger?: string;

  public willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('trigger') {
      this.removeEventListener(changedProperties.get('trigger'), this.eventHandler);
      this.addEventListener(this.trigger, this.eventHandler);
    }
  }

  private eventHandler(): void {
    // do stuff.
  }
}
```

Events are even easier if you know the name of the event you're wanting to listen for will be the same throughout the lifecycle of your application. With that knowledge you can listen just once without needing to add/remove the listener based on even name changes over time:

```js
@customElement('menu-trigger')
export class MenuTrigger extends LitElement {
  public constructor() {
    super();
    this.addEventListener('known-event-name', this.eventHandler);
  }

  private eventHandler(): void {
    // do stuff.
  }
}
```

Done and done!

## styleMap usage

Lit's `styleMap()` directive helps when setting the `style` attribute on HTML elements from JavaScript. It accepts an object with css-property keys and string, `undefined`, or `null` values. This means you can prevent a CSS property from being added to the element by passing `null` or `undefined` as the value, e.g.:

```js
import {styleMap} from 'lit/directives/style-map.js';
// ...

  render() {
    return html`
      <p
        style=${styleMap({
          border: '1px solid',
          width: '200px',
          float: undefined, // I don't show a type mismatch
          margin: 10, // I do show a type mismatch
        })}
      >Hello, world!</p>`;
  }
```

[Check it out here.](https://lit.dev/playground/#project=W3sibmFtZSI6InNpbXBsZS1ncmVldGluZy50cyIsImNvbnRlbnQiOiJpbXBvcnQge2h0bWwsIGNzcywgTGl0RWxlbWVudH0gZnJvbSAnbGl0JztcbmltcG9ydCB7Y3VzdG9tRWxlbWVudCwgcHJvcGVydHl9IGZyb20gJ2xpdC9kZWNvcmF0b3JzLmpzJztcbmltcG9ydCB7c3R5bGVNYXB9IGZyb20gJ2xpdC9kaXJlY3RpdmVzL3N0eWxlLW1hcC5qcyc7XG5cbkBjdXN0b21FbGVtZW50KCdzaW1wbGUtZ3JlZXRpbmcnKVxuZXhwb3J0IGNsYXNzIFNpbXBsZUdyZWV0aW5nIGV4dGVuZHMgTGl0RWxlbWVudCB7XG4gIHN0YXRpYyBzdHlsZXMgPSBjc3NgcCB7IGNvbG9yOiBibHVlIH1gO1xuXG4gIEBwcm9wZXJ0eSgpXG4gIG5hbWUgPSAnU29tZWJvZHknO1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gaHRtbGBcbiAgICAgICAgPHBcbiAgICAgICAgc3R5bGU9JHtzdHlsZU1hcCh7XG4gICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkJyxcbiAgICAgICAgICB3aWR0aDogJzIwMHB4JyxcbiAgICAgICAgICBmbG9hdDogdW5kZWZpbmVkLFxuICAgICAgICAgIG1hcmdpbjogMTAsXG4gICAgICAgIH0pfVxuICAgICAgICA-SGVsbG8sICR7dGhpcy5uYW1lfSE8L3A-YDtcbiAgfVxufVxuIn0seyJuYW1lIjoiaW5kZXguaHRtbCIsImNvbnRlbnQiOiI8IURPQ1RZUEUgaHRtbD5cbjxoZWFkPlxuICA8c2NyaXB0IHR5cGU9XCJtb2R1bGVcIiBzcmM9XCIuL3NpbXBsZS1ncmVldGluZy5qc1wiPjwvc2NyaXB0PlxuPC9oZWFkPlxuPGJvZHk-XG4gIDxzaW1wbGUtZ3JlZXRpbmcgbmFtZT1cIldvcmxkXCI-PC9zaW1wbGUtZ3JlZXRpbmc-XG48L2JvZHk-XG4ifSx7Im5hbWUiOiJwYWNrYWdlLmpzb24iLCJjb250ZW50Ijoie1xuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJsaXRcIjogXCJeMi4wLjAtcmMuMlwiLFxuICAgIFwiQGxpdC9yZWFjdGl2ZS1lbGVtZW50XCI6IFwiXjEuMC4wLXJjLjJcIixcbiAgICBcImxpdC1lbGVtZW50XCI6IFwiXjMuMC4wLXJjLjJcIixcbiAgICBcImxpdC1odG1sXCI6IFwiXjIuMC4wLXJjLjNcIlxuICB9XG59IiwiaGlkZGVuIjp0cnVlfV0)

The current version of Lit's styleMap excludes numbers as values. You might expect Lit to automatically convert numbers to `px` values, but on second thought that isn't actually what you'd want. In CSS, where `px` is just one of many units that a numeric CSS property could accept (`%`, `vh`, `vwmax`, `pt`, `em`, `rem`, `pt`, `pc`, _ad infinitum_), there's no way for Lit to know or even assume what kind of number you're using. On top of that, you might want to apply unit-less numbers directly to your styles:

<figure>

```js
class XL extends LitElement {
  static styles = css`
    output {
      background-color: hsl(var(--hue, 0) 50 100);
    }
  `;
  @property({ type: Number }) hue = 0;
  render() {
    return html` <output style=${styleMap({ '--hue': this.hue.toString() })}></output> `;
  }
}
```

<figcaption>
Thanks @bennypowers for the code sample here.
</figcaption>
</figure>

Defaulting numbers to `px` would be a foot-gun. Instead, Lit encourages you to be explicit with your CSS code. Doing so not only helps your consumers, but your teammates and future self as well when it comes time to maintain the components that you create.

---

One of the best things about `lit-html`, the renderer underlying LitElement, is that, if you want to live on that wild side, you could easily create your own directive that applied number typed properties as `px` and leverage it in your own work. Here are [the docs](https://lit.dev/docs/templates/custom-directives/) for doing just that! If you're still not convinced, check out some [directives with which I've experimented](https://dev.to/open-wc/doing-a-flip-with-lit-html-2-0-3gn4).

NOTE: the above article, "Doing a FLIP with lit-html@2.0", was written against an RC of `lit@2.0` and may not be 100% current. I'll be looking to update it here, soon.

## Conclusion

When you're learning a new piece of software, by all means, start by comparing it to something that you know. It's like a cheat code to getting started down the path of learning something new. Once you've done that, don't stop there, get into a real use case with it and learn what sort of capabilities or techniques it unlocks or supports. Only then can you really get into the question of why it's doing so and whether in the context that it is intended to be used (or the context that you might use it) it's the sort of tool you want to leverage for the job.

---

If you do get to building something with LitElement, come share it here and let's chat about the whats and whys of what you've done/are trying to do. I look forward to seeing it here in the comments, or hit me up on the [Lit & Friends Slack](https://join.slack.com/t/lit-and-friends/shared_invite/zt-llwznvsy-LZwT13R66gOgnrg12PUGqw)!
