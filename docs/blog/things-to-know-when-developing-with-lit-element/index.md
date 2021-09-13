---
title: 'Things to know when developing with LitElement'
pageTitle: 'Things to know when developing with LitElement'
date: 2021-09-13
published: true
description: 'Test driving the new APIs powering directives in lit-html@2.0 makes you do a FLIP.'
tags: [litelement, webcomponents, typescript, learning]
canonical_url: https://open-wc.org/blog/things-to-know-when-developing-with-lit-element/
cover_image: /blog/things-to-know-when-developing-with-lit-element/images/blog-header.jpg
socialMediaImage: /blog/things-to-know-when-developing-with-lit-element/images/social-media-image.jpg
---

When reviewing software that you've maybe not used a lot of or are maybe interested in learning more of, it's pretty common to attempt to compare it to software you have used before. That can be quite useful in getting a handle on the general ergonomics and decisions behind the two pieces of software in question. However, one thing that this approach is not particularly good at is comparing the new software in situation. You may have spent a good amount of investigation and research getting comfortable with the software you know in the situation that you've decided to use it in, so much so, that it may even be the best solution available in that context. Comparing this new software in that context (unless it, too, is purpose-built for that context) is often a disservice to the software under test, as well as your ability to fully understand the benefits of that software.

This is what I keep coming back to when people say things like "X isn't as good as Y" when "X" is a way to build web components ([of which there are many](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/)) and "Y" is a JS framework. Before you fill in the actual names on either side of the equation the differences in situation is huge:

- JS frameworks often want to own most or all of a page, whereas a web component is a single custom element on an otherwise large and diverse DOM tree.
- Functional JS frameworks often hide much of that ownership from view to both the benefit (less code) and expense (less flexibility) of a developer.
- JS Frameworks, often not being directly tied to the DOM have the ability to make a wider number of JS concepts look to be a part of their purview than DOM-based web components.
- Web components being a DOM element can interact with their position in the DOM in the ways you'd otherwise need to bend over backward to do in a framework.
- JS frameworks often ship a lot of JS down the wire that may or may not be required by your application or component regardless of whether the framework author has decided to give you the ability to manage how much of that code makes it into your production build or not.
- Web components, as JS classes, are already a container for state while a functional JS framework needs to synthesize that concept via custom code or mimic that via state management libraries.
- Web components are portable to just about any context in which you'd build web UI while JS frameworks generally require that any code you'd like to share live in an app context run by the same JS framework.
- and, much, much more.

Some or all of these points could be seen as being for or against either side of the conversation. Many of these could subsequently switch sides as you subtly alter the context in which the code in question shifts. Too often a review that fails to take this into account births a half-baked, often hypercritical, review of using one in place of the other.

With this in mind, I wanted to go through some concepts that might support people making a healthy decision as to whether a LitElement based web component might be right for them or a project that they're working on. This isn't really a "how-to", though I've got some (slightly) dated version of that available in my ["Not Another To-Do App" series](https://dev.to/westbrook/not-another-to-do-app-2kj9). This is more of a, "you might want to know about these techniques" as they're not exact ports from another context (particularly functional JS frameworks), and being able to judge the difference from a place of knowledge might prove useful to you.

---

## Default Values

If you'd like to define default values for a property on a LitElement based custom element, there are a number of ways that you could do this. While some do require management across the entire element class, we'll ignore those today as there are a number of options that do not require such work.

First off, there's a very direct comparison between LitElement and a functional approach to UI development where you could consider the `render()` method of a LitElement as an almost 1 to 1 conversion from the functional definitions found in other offerings. In this way, you could assume `render()` is the only entry into your properties and leverage your fallbacks like so:

```js
render() {
  const closeDelay = this.closeDelay ?? 300;
  ...
}
```

From here, you could get very close to simply copy and paste the rest of a functional UI component into a LitElement for an early test of its capabilities. Leveraging scoped variables like this, rather than class properties, does leave you in much the same place that functional alternatives to UI development do; needing additional tools for memoization of that scope. As using LitElement means you're already in a class context, we can use the capabilities of a class directly rather than synthesizing them with memoization.

A simpler approach to merging the two concepts is to set that fallback into the class property itself. Above I showed doing this in the `render()` lifecycle method, however, I find it much nicer to _only_ have the template surfaced therein. Leveraging one of the earlier lifecycle methods for managing defaults, validation, sanitation, transformation, or derivation help to maintain that structure. In this case, we'll use `willUpdate()` which doesn't require a `super` call or a returned value, but will always be visited during each render lifecycle:

```js
willUpdate(changedProperties: PropertyValues<this>): void {
  this.closeDelay = this.closeDelay ?? 300;
}
```

With this approach, you can most closely facilitate the single line defaulting that can be present when relying on a function to define a component. This does mean the `shouldRender()` the first method in the render lifecycle will not have your default value, and if that's an issue for your style of element development, you might want to move this fallback work there, but it also means that due to the fact the LitElement renders asynchronously there's technically a possibility that your local methods could be as well. Due to this fact, you may want to leverage a slightly more complete approach to a default.

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

This does eclipse the simplicity of a functional solution as we are choosing to apply the default by writing our own getter/setter pair on the property. At the same time, however, we've fallen into a possible trap of the functional fallback approach (and as the `willUpdate()` approach above), we're allowing our entire render lifecycle to be triggered for what might not be an actual change to our component state. Where `this.closeDelay` to already equal `300` and the application to change it to `undefined`, all of these approaches we've looked at so far would cause whatever could occur in your render lifecycle to occur without need.

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

Typescript loves a good `"Property is not definitely assigned in the constructor"` warning, and if you like Typescript enough to use it a lot, you'll likely run into it at some point. It's telling you this, because in contrast to what you've been told Typescript is NOT smarter than you and it can't tell if something _should_ always be available, only if it _might_ not be available, sometime. You can set an initial value to a property, and it'll never yell:

```js
class MyThing extends LitElement {
  myProperty = 'string'; // always available, always a string
}
```

If you're looking for that to _have_ to be initialized to use your element, so _you_ KNOW it's going to always have a value, but you want the consumer to initialize it, then you can tell Typescript that being the `!` operator once and be done with it:

```js
class MyThing extends LitElement {
  myProperty!: String; // no initial value, but a string is required from the consumer
}
```

If you still want to be defensive, you an add some helper code in your lifecycle to support a consumer leveraging your custom element correctly:

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

In this way, you can also manage required properties/attributes. No, it doesn't fall within the available management of a tool-based contract with the consumers of your component, however, a tool-based contract is not strictly enforceable. You as a component author can tell Typescript or a linter to error on certain things, but you consumer can tell them not to just as easily. Deciding to _only_ leverage tooling for this sort of capability might mean less work for you, but it doesn't guarantee better outcomes for your consumers. Any component author will need to decide the risks they are willing to foist onto their consumers when publishing a component, and this is yet another item to manage on that list.

## Event management

Event listeners add on `this` directly in a custom element DO NOT need to be cleaned up when disconnected from the `document`. Once all references to the element are released, the same garbage collection that cleans up the element itself will clean up the events bound to it. What's more, when binding events to `this`, you don't need to bind the method, so you can call a class method directly without any `.bind(this)` or `() => {}` whatsoever.

```js
@customElement('menu-trigger')
export class MenuTrigger extends LitElement {
  @property({type: String})
  trigger?: string;

  public willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('trigger') {
      this.removeEventListener(changedPeroperties.get('trigger'), this.eventHandler);
      this.addEventListener(this.trigger, this.eventHandler);
    }
  }

  private eventHandler(): void {
    // do stuff.
  }
}
```

Events are even easier if you know the name of the event you're wanting to listen for will be the same throughout the lifecycle of your application. With that knowledge you can listen just once without needing to add/remove the listener based on even name changes overtime:

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

Contrary to what you might read in the documentation site (PRs are incoming to correct, so you may miss it altogether!), `styleMap()` does accept `[name: string]: string | undefined | null;` which allows you to leverage `undefined` to prevent a property from being added to the style of an element, e.g.:

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

You aren't able to use numbers directly, no. However, the foot gun of lacking clarity in your code that unearths makes preventing this input a pretty good idea. In a world where `px` is just one of many units that a CSS property could accept (`%`, `vh`, `vwmax`, `pt`, `em`, `rem`, `pt`, `pc`, ad (almost) infinitum) being explicit with your code with not only help your consumers, but it'll help your future self maintain the components that you create. On top of that, there are numbers that you'll eventually want to apply to your styles that won't beg for the application of a unit at all:

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
    return html` <output style=${styleMap({ '--hue': this.hue })}></output> `;
  }
}
```

<figcaption>
Thanks @bennypowers for the code sample here.
</figcaption>
</figure>

---

One of the best things about `lit-html` the renderer underlying LitElement is that, if you want to live on that wild side, you could easily create your own directive that applied number typed properties as `px` and leverage it in your own work. Here are [the docs](https://lit.dev/docs/templates/custom-directives/) for doing just that! If you're still not convinced, check out some [directives with which I've experimented](https://dev.to/open-wc/doing-a-flip-with-lit-html-2-0-3gn4).

NOTE: the above article, "Doing a FLIP with lit-html@2.0", was written against an RC of `lit@2.0` and may not be 100% current. I'll be looking to update it here, soon.

## Conclusion

When you're learning a new piece of software, by all means, start by comparing it to something that you know. It's like a cheat code to getting started down the path of learning something new. Once you've done that, don't stop there, get into a real use case with it and learn what sort of capabilities or techniques it unlocks or supports. Only then can you really get into the question of why it's doing so and whether in the context that it should be used (or the context that you might use it) it's the sort of tool you want to leverage for the job.

---

If you do get to building something with LitElement, come share it here and let's chat about the what's and why's of what you've done/are trying to do. I look forward to seeing it here in the comments, or hit me up on the [Lit & Friends Slack](https://join.slack.com/t/lit-and-friends/shared_invite/zt-llwznvsy-LZwT13R66gOgnrg12PUGqw)!
