---
title: 'Doing a FLIP with lit-html@2.0'
pageTitle: 'Doing a FLIP with lit-html@2.0'
date: 2020-12-28
published: true
description: 'Test driving the new APIs powering directives in lit-html@2.0 makes you do a FLIP.'
tags: [webcomponents, lithtml, litelement, javascript]
canonical_url: https://open-wc.org/blog/doing-a-flip-with-lit-html-2-0/
cover_image: /blog/doing-a-flip-with-lit-html-2-0/images/blog-header.jpg
socialMediaImage: /blog/doing-a-flip-with-lit-html-2-0/images/social-media-image.jpg
---

# Doing a FLIP with lit-html@2.0

There's nothing like a good vacation to get the desire to try out a new piece of technology to grow like a weed in my mind. Especially if it promises to make my work not only easier, but faster and more fun at the same time. Enter the upcoming releases of `lit-html` and `LitElement`; a powerfully light renderer and a productively simple custom elements base class, respectively. These fine products from the Polymer team at Google have been an important part of my work for going on 3 or so years now, along with many other offerings from the team in the years before that, so my interest was piqued when they released their first preview build of both earlier this year. These initial looks into the new code structure of the two libraries didn't offer much in new features, but each pointed to a powerful new future that the Polymer team had been laying out for itself. So, when a second round of previews was dropped, just before the holiday break, this time supporting both new APIs and features, I couldn't wait to jump in and take a look around.

First off, if you're interested in the nitty-gritty, I suggest you start by taking a look at the README's for the latest releases of [`lit-html`](https://github.com/Polymer/lit-html/blob/lit-next/packages/lit-html/README.md) and [`LitElement`](https://github.com/Polymer/lit-html/blob/lit-next/packages/lit-element/README.md) to get right into all the things that have been or will be changed before a stable release early 2021. There are a lot of cool things, not least of which is the desire to cause as few breaks as possible when moving our use of `lit-html@1.0` and `LitElement@2.0` to the new versions. The biggest break looks to be in the change from a functional to a class-based API for the directive functionality offered by `lit-html`. While I use directives a good amount in my work, I've mainly worked with the ones [built-in to `lit-html`](https://lit-html.polymer-project.org/guide/template-reference#built-in-directives) by default. I'd only really built my own directives once or twice, and being I use these tools to work with custom elements (which are themselves class-based), I agree that this change is for the better of the ecosystem these tools serve. With this simplification of context, I thought directives would be a great place to take a look at what's going to be possible in the near future.

## My directives to date

I've recently started working with a "streaming listener" directive in my work with Adobe's [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) for a number of in-development patterns, to nice success. The [Open Web Components](https://open-wc.org/) team and I vend a series of `lit-helpers`, one of which is a [spread directive](https://open-wc.org/docs/development/lit-helpers/#spread-directives) for `lit-html@1.0` that simplifies spreading multiple attributes/event listeners/properties/etc. onto an element. Before getting into really new features, I took a pass at updating these.

### Spreading it on thick

If you've worked with virtual DOM in the past you might be used to the ability to do something like `<Component {...props} />`, which is a powerful way to get an unknown number of properties applied to a component. A lot of talk around how and why to support this functionality when into [this issue](https://github.com/Polymer/lit-html/issues/923) and what came out allows you to do the following:

```javascript
import { html, render } from 'lit-html';
import { spread } from '@open-wc/lit-helpers';

render(
  html`
    <div
      ...=${spread({
        'my-attribute': 'foo',
        '?my-boolean-attribute': true,
        '.myProperty': { foo: 'bar' },
        '@my-event': () => console.log('my-event fired'),
      })}
    ></div>
  `,
  document.body,
);
```

I'll admit to being a little reticent about the need to include sigils demarcating which type of value is being spread onto the element, but once you've been working with `lit-html` for a while it starts to feel a little more normal.

What's particularly at question here is the use of the `...` "attribute" to bind the directive to the element. What is the `...` attribute? Is it a property named `..`? (Note the `.` sigil demarcates a bound value should be applied as a property.) Is it magic syntax? No, it's a requirement of the v1.0 parser when binding directives to an element that _something_ be used to ensure associate to the elements and `...` representing spread/destructuring in JS, it was included here in a question inducing way. Enter element expressions in the new releases and this is no longer needed.

```javascript
import { LitElement, html, css } from 'lit-element@next-major';
import { spread } from './spread.js';

class MyElement extends LitElement {
  render() {
    return html`
      <button
        ${spread({
          'my-attribute': 'foo',
          '?my-boolean-attribute': true,
          '.myProperty': { foo: 'bar' },
          '@my-event': () => console.log('my-event fired'),
          '@click': event => event.target.dispatchEvent(new Event('my-event')),
        })}
      >
        This button has a bunch of things spread on it.
      </button>
    `;
  }
}

customElements.define('my-element', MyElement);
```

Beyond the ease of not needing a binding sigil, there isn't a whole lot of change in the usage here. Even in the implementation, there's not a whole lot of change to go from the functional to the class based code structure. You can see this running live in the browser/in code, here: https://webcomponents.dev/edit/XugyS6YAQnEQXcS7YVKk. You can also take a closer look at the difference between the [v1.0](https://github.com/open-wc/open-wc/blob/master/packages/lit-helpers/src/spread.js) and [v2.0](https://webcomponents.dev/edit/collection/PfCT8IzVVjUxI3JiaF6x/XugyS6YAQnEQXcS7YVKk?file=src%2Fspread.ts) implementations.

You'll see some of the cleanliness that class syntax brings to event listening generally. For instance, the ability to use the `eventHandler` pattern to more simply distribute the events to appropriately bound methods. Look closer and you'll see the addition of the `connectedCallback` and `disconnectedCallback` to the `DisconnectableDirective` base class leveraged therein. This allows the directive to clean up work that it's done while the part it relates to is not attached to the DOM. In this instance this allows us to add and remove event listeners when they are not needed.

### The endless stream of time

Some DOM events are built for a streaming form of listening by default (e.g. `pointerdown` outlines the beginning of a stream of `pointermove` events that end with a `pointerup`) and make it really clear what the boundaries at both ends of the stream are. Some DOM events are not built this way (e.g. `input` starts a stream of `input` events that end of a `change`) and need a little something extra to ensure they are consumed appropriately.

In fact, streaming is so fun that you can say that again.

Some DOM events are built for a steaming form of listening by default (e.g. a `change` event marks the end of a stream of `input` events that don't fire again until a new stream starts) and make it really clear what the boundaries at both ends of a stream are. Some DOM events are not built this way (e.g. `pointermove` streams regardless of which side of a `pointerdown` or `pointerup` event you're on) and need a little something extra to ensure they are consumed appropriately.

Whichever side of my mind I might be in agreement with in any given moment, I created the [streaming listener directive](https://webcomponents.dev/edit/ar6PrCzLTsv9wunVnifw) to better support this reality. On top of maintaining the stateful progression of a stream, a streaming listener allows for binding fewer events at runtime by using the current state of the stream to determine what binding to do which can improve performance as well. Take a look at how this might be leveraged:

```javascript
import { streamingListener } from "./streaming-listener";

// ...

<input
  type="range"
  min="0"
  max="100"
  @manage=${streamingListener(
    { type: "input", fn: this.start },
    { type: "input", fn: this.stream },
    { type: "change", fn: this.end }
  )}
/>
```

Here the directive supports the ability to bind `input` events to both `this.start` and `this.stream` depending on the state of the stream. This allows for only a single event to be bound to the `<input>` at any one time without you needing to manage this (or any other state in regards to your event listening) locally increasing performance and reducing the chances of copy/paste centric bugs when leveraged across multiple contexts.

While I've made some feature additions and API changes when going between the [v1.0](https://webcomponents.dev/edit/ar6PrCzLTsv9wunVnifw?file=src%2Fstreaming-listener.ts) and [v2.0](https://webcomponents.dev/edit/collection/PfCT8IzVVjUxI3JiaF6x/w9bQYjy7dvlMEKW4MDJY?file=src%2Fstreaming-listener.ts) implementations, the biggest benefit of the class syntax that I see is the ability to more directly keep the state necessary to empower the directive. Previously this was done through the use of the following `WeakMap`s:

```javascript
const previousValues = new WeakMap<
  Part,
  {
    start: { type: string; fn: (event) => void };
    stream: { type: string; fn: (event) => void };
    end: { type: string; fn: (event) => void };
    removeEventListeners: () => void;
  }
>();

const stateMap = new WeakMap<Part, boolean>();
```

With these hanging around in the module scope, we are able to take advantage of the idea that the `Part` representing the location of the directive in the template is an object that keeps identity across multiple renders, which allows us access to stored state on subsequent render passes. However, this can feel a little magic... why is this `Part` always the same? Can I really rely on that? Why did I make `previousValues` and `stateMap` separate? Oh, wait, that's not about magic, that's just me code reviewing myself...

In the `lit-html@2.0` version, we can avoid these questions altogether by leveraging the class syntax to do exactly what classes are meant to do, keep state. We also leverage some nice defaults in our directive arguments to make it easy to apply the directive not only for events streaming between a "start" and "stop" event but also as an on/off listener for enter/leave style events as well as to stream events (like `pointermove`) on on the outside (or between "stop" and "start") of our stream:

```javascript
<canvas
  ${streamingListener({
    start: ["pointerdown", this.start ],
    streamInside: [ "pointermove", this.streamInside ],
    end: [ "pointerup", this.end ],
    streamOutside: [ "pointermove", this.streamOutside ]
  })}
></canvas>
```

This really takes the streaming listener directive to a whole other level, all with only the smallest amount of additional code, and a clearer API both internally and externally.

Seeing what it looks like to update places I've been, I was even more excited to see where these new APIs might be able to take us with new possibilities.

## Element expressions

In both of the above examples, we were able to remove extraneous binding locations thanks to "element expressions" that allow you to bind a directive directly to the element that it is applied to, rather than a specific part that you've outlined with an "attribute". For the spread directing that reduced `<div ...=${spread({...})></div>` to `<div ${spread({...})></div>` and `<div @manage=${streamingListener({...},{...},{...})}></div>` to `<div ${streamingListener({...})}></div>`, a win for brevity and clarity. Using this feature, the `ref()` directive was added to the `lit-html` built-ins giving us the ability to cache a reference to an element as it is rendered:

```javascript
import { render, html } from 'lit-html';
import { createRef, ref } from 'lit-html/directives/ref.js';

const inputRef = createRef();
render(html`<input ${ref(inputRef)} />`, container);
inputRef.value.focus();
```

This greatly reduces the work need to get a reference to an element when using `lit-html` alone, and, whether using `lit-html` directly or as part of `LitElement`, prevents the need to query the element again after rendering. Take a [test drive](https://webcomponents.dev/edit/collection/PfCT8IzVVjUxI3JiaF6x/tpjqACEiKS6YF4LV3lJs) of the `ref()` directive in this `lit-html` only demo. I see this as a great feature for leveraging `lit-html` in something like StorybookJS where you will be working with pre-built custom elements and no wanting to make a new wrapping element or strange workaround to have access to elements post-render. But, what element expressions really make available are things like:

<blockquote class="twitter-tweet"><p lang="und" dir="ltr">🤯 <a href="https://t.co/Ty1x9FkSpT">https://t.co/Ty1x9FkSpT</a></p>&mdash; Westbrook (@WestbrookJ) <a href="https://twitter.com/WestbrookJ/status/1341558826101846016?ref_src=twsrc%5Etfw">December 23, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Let's do a FLIP

First, what is [FLIP](https://aerotwist.com/blog/flip-your-animations/)? Paul Lewis says it best, so definitely check out his blog, but the short story is:

- set the (F)irst frame of your animation and cache the values you're looking to animate
- set the (L)ast frame of your animation and cache the target values again
- apply the (I)nverted values of those properties to the end frame
- and then (P)lay the animation by removing them with a `transition` applied

This works best with things that can be applied as `transforms` or `opacity`, as they can be rendered on the GPU for maximum performance.

Generally, the tricky parts are doing the work between the first and last frames (but this is simplified by a multi-pass render as the first frame will simply be the previous render and the last frame will be the current render) and then calculating the inverted values on the element. In the example that we are about to borrow from the [Svelte documentation](https://svelte.dev/tutorial/animate) we'll be focusing specifically on position properties which will allow us to keep that math a little more contained.

## Or, rather, a `${flip()}`

The `${flip()}` loosely referenced by Justin Fagnani in the above tweet theorized a list of items that when rearranged uses a "FLIP" algorithm to ensure that the motion between one place in the list and the next is smoothly animated. In the Svelte example, not only are there two lists, but you can remove items from those lists, which is where the real fun starts. (disclaimer: maybe we have different definitions of "fun"...)

Before we get deeper into how it works, take a look at the [code in practice](https://webcomponents.dev/edit/collection/PfCT8IzVVjUxI3JiaF6x/9hcibsyvtFA7tWwRj8gL). Like most to-do apps (and [I've made](https://dev.to/westbrook/litelement-to-do-app-4ngn) [a few](https://dev.to/westbrook/not-another-to-do-app-2kj9)...haven't we all?), you're able to add an item, mark the item as "done" (or not), and delete the item. Adding will automatically append the item to the "todo" list. Clicking an item will toggle it between "todo" and "done", which will cause it to animate between the to lists and the remaining items in its original list to animate to fill the space the toggled item previously took up. Using the "delete" button will fade the item into the background while the remaining items smoothly fill up the previously used space. Try it out, do weird stuff, report bugs!

### How's it work?

Taking the code pretty straight out of the above Tweet:

```javascript
${repeat(
  this.items,
  i => i.id,
  i => html` <li ${flip()}>${i.name}</li> `,
)}
```

The `repeat()` directive built-in to `lit-html` allows you to loop over an array of items and then the optional `id` argument is passed (here we see it as `i => i.id`) the directive will maintain a single template instance for each item. This means that the instance of the `flip()` directive in each item will be the same regardless of where the item appears in the array order and we'll be able to cache the position of the item in the page from one render to the next. You'll see this in the code where we save the value returned by `getBoundingClientRect()` on the `boundingRect` property of the directive class. This way we can easily use that cached value to determine our "first" frame. We then wait for the `Promise.resolve().then()` timing (the timing on which [`LitElement` batches its updates](https://dev.to/thepassle/litelement-a-deepdive-into-batched-updates-3hh)) to capture the "last" frame of our animation. We then take the delta so we can "invert" the values before "playing" the animation via the CSS `transition` property.

```javascript
flip(
  firstStyleMap: {[property: string]: string},
  lastStyleMap: {[property: string]: string},
  listener: (event?: any) => void = () => {},
  removing?: boolean,
) {
  const previous = this.boundingRect;
  this.boundingRect = this.element.getBoundingClientRect();
  const deltaX = previous.x - this.boundingRect.x;
  const deltaY = previous.y - this.boundingRect.y;
  if (!deltaX && !deltaY && !removing) {
    return;
  }
  const filteredListener = (event: TransitionEvent) => {
    if (event.target === this.element) {
      listener(event);
      this.element.removeEventListener('transitionend', filteredListener);
    }
  }
  this.element.addEventListener('transitionend', filteredListener);
  const translate = `translate(${deltaX}px, ${deltaY}px)`;
  this.applyStyles({
    ...firstStyleMap,
    transform: `${translate} ${firstStyleMap.transform ?? ''}`,
  });
  requestAnimationFrame(() => {
    const transition =
      `transform ${this.options.duration}ms ${this.options.timingFunction} ${this.options.delay}ms`;
    this.applyStyles({
      ...lastStyleMap,
      transition,
      transform: `${removing ? `${translate} ` : ''}${lastStyleMap.transform ?? ''}`,
    });
  });
}
```

With that, all of the repositioning within a single list works like a dream. But, you may remember that in the Svelte demo we're recreating there actually are two different lists that elements animate between, as well as an animation that occurs when an element is removed from all lists, and if you do you may already be seeing where things need to get tricky.

### When items are the same but not the same...

While the `repeat()` directive is great for associating an item to a DOM template within a single instance, it doesn't currently do this across multiple instances. This means that the DOM for a "todo" item and a "done" item with the same ID will not actually be the same and, what's worse, nor will the `flip()` directive that manages that DOM. To support this context, we _will_ be needing a manage a little bit of state outside of our directive class and to do so you'll see `const disconnectedRects = new Map();`, where we will cache the position values of elements from directives that have been disconnected from the DOM. To power this approach, we'll also add an optional `id` to our directive's properties.

```javascript
${repeat(
  this.todos.filter(t => !t.done),
  todo => todo.id,
  (todo) => html`
    <label ${flip({id: todo.id})}>
      <input
        type=checkbox
        ?checked=${todo.done}
        @change=${() => this.mark(todo, true)}
      >
      ${todo.id}: ${todo.description}
      <button
        @click=${() => this.delete(todo)}
        class="button"
      >remove</button>
    </label>
  `)
}
```

With this id cached on to our directive class and the `disconnectedCallback()` that we learned about above, we'll be able to store the position of our element in a place where the next directive of the same id can find it. Here you'll see how a directive without a value for `boundingRect` will first check to see if there _was_ a rect for its id before generating a new one:

```javascript
this.boundingRect = disconnectedRects.has(this.id)
  ? disconnectedRects.get(this.id)
  : this.element.getBoundingClientRect();
disconnectedRects.delete(this.id);
```

This allows the "new" instance of that directive to use the last position of the "old" instance for the "first" frame of its ensuing animation, which makes it appear as if the item is animating from one list to the next. Here we also denote that the item is no longer "disconnected" by removing its rect from the `disconnectedRects` cache.

### When are the items not there at all?

Our items now animate with a list and between lists, but when an item is deleted, it's gone. What do we do then? This is where is good to know about your [Tasks, microtasks, queues and Schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) in javascript. Go ahead and get your read on, I'll wait.

In `LitElement`, as we learned earlier, updates are batched in `Promise.resolve().then()` (or microtask, at the end of the current task) time. In a standard animation, particularly one that FLIPs, you'll do work in `requestAnimationFrame()` (`rAF()`) time (or just before the _next_ frame). We can use this to empower our "delete" animation.

Above we learned about some housekeeping that we were doing in microtask time: `disconnectedRects.delete(this.id)`. This is run when a directive is new and has possibly just pulled this rect out of the cache for use in a subsequent animation. However, when an item is deleted there will be no new items with the same id, and this cache will not be cleaned up. This means that in `rAF()` time this rect will still be in the cache and we can add the following to our `disconnectedCallback()`:

```javascript
requestAnimationFrame(() => {
  if (disconnectedRects.has(this.id)) {
    this.remove();
  }
});
```

This means that the position data saved in the directive can serve as the "first" frame of our "delete" animation and by appending the cached element (which is no longer on the DOM due to the previously completed render pass) to the previously cached parent, we can trigger the "delete" animation as follows:

```javascript
remove() {
  this.parent.append(this.element);
  this.flip(
    { zIndex: '-1' },
      {
        transform: 'scale(0.5)',
        opacity: '0.5',
      },
      () => {
        this.element.remove();
        disconnectedRects.delete(this.id);
      },
      true
  );
}
```

And then, we have our complete animated todo list with the single addition of a `${flip({id})}`.

## What else does it do?

You'll notice that the settings for `flip()` also takes an `options` parameter. This surfaces the ability to customize the transitions via the following `Options` type:

```javascript
type Options = {
  delay?: number,
  duration?: number,
  timingFunction?: string,
};
```

Playing with this I discovered that there's a `step()` function available in the CSS `transition-timing-function` which is super cool. The only problem is that `step(6, end)` causes the animation to look like it's running at about two frames per second (e.g. not buttery smooth) if you aren't prepared for it.

## What else could it do?

While I noticed that my `LitElement` implementation of this interface came in right around the same number of lines of code as the notoriously terse Svelte did (give or take some TS definitions), I do realize that the original version leverages the ability to customize the "delete" animation from the outside. My example does not currently do this. It doesn't currently allow for any special customization of any of the animations. However, these animations are powered is pseudo [`styleMap`](https://lit-html.polymer-project.org/guide/template-reference#stylemap) objects and as such could be passed additional properties to animate. This would allow consumers to even more finely tune the animation you get between renders and could open some really fun paths in the future. It's important to remember (as we salivate over the possibility) which CSS properties can be [performantly animated](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/). In this way, maybe the right level of power would be to and options for `opacity` and `scale` (possibly as an opt-in that worked with width/height from the rect internally) so as to ensure users ship high-quality experiences.

One pattern that I've enjoyed recently that could be built onto this is the surface the sizing deltas a CSS Custom Properties to be consumed across a number of CSS properties via `calc()`. I originally discovered this technique in this great [Keyframers tutorial](https://www.youtube.com/watch?v=SXtFBXmwgLQ&feature=youtu.be) and then later expanded on it with the help of [Hounini's `CSS.registerProperty`](https://developer.mozilla.org/en-US/docs/Web/API/CSS/RegisterProperty) currently available in Blink based browsers to be even more buttery smooth by helping it even more [correctly handle the scaling of animating surfaces with rounded corners](https://codepen.io/Westbrook/pen/vYNJjyg). I'll save this sort of advanced application for after the `lit-*` releases go stable, however.

## What do you think?

Is this a cool evolution of the `lit-html` and `LitElement` ecosystem? Does it make you excited for the pending stable release? Can you already imagine the great things you'd like to build with it?

Tell me all about it!

Building for the web is all that much more exciting when we're doing it together, so I hope you'll share your thoughts on these new APIs and how I've leveraged them for good or naught I know it helps me make better code, and hopefully it does the same for you (or there next reader that visits).

---

<span>Photo by <a href="https://unsplash.com/@arstyy?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Austin Neill</a> on <a href="https://unsplash.com/s/photos/flip?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
