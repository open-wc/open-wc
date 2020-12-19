# Knowledge >> Events ||40

Events in the DOM can span in complexity from responding to a `click` on a `<button>` element to orchestrating the entirety of an application's logic and state. For some insight on how that spectrum might be possible, take some time to check out [`composed: true` considered harmful?](https://dev.to/open-wc/composed-true-considered-harmful-5g59) for a more complete review of the DOM Events API at large. Get started using events in your web components with the recommendations below.

## TLDR

### Event listening

- events on DOM elements that you create should be handled via `@some-event` in the template (let `lit-html` do the actual wire-up)
- events on your custom elements should be listened for in `constructor` (no need to clean up - as it will be garbage collected when the last reference the element is removed)
- events on elements outside of scope (ex. `window`) should be listened for in `connectedCallback`, and removed in `disconnectedCallback` (prevents ghost listeners when the element is removed)

### Event dispatching

- prefer "just" events without `bubble` or `composed` e.g. `new Event('something-happened')`
- when needing data consider extending `Event` or using `CustomEvent`
- use `bubble: true` if a node up the tree needs the event
- retrain from using `composed: true` as it leads to event pollution

## Events playground

There are lots of times when words just aren't enough to really get clarity on a topic, and with all the complexity and power of DOM events, a picture (interactive demo) really is worth a thousand words. The following Glitch allows you to dispatch events with various configurations and track how that event travels around the DOM based on various event handling techniques. Having a deep understanding of how this specific feature of the DOM works can really unlock a lot of possibilities for your components and applications.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/super-area?path=all-three.js&previewSize=100"
    title="super-area on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Event listening

When preparing to listen for events in your code, do the least work possible. Not only because this allows you to do less work now, but it allows you also to do less work later, and most importantly it allows the browser to do less work, which means a more performant application or component. The least work possible changes per context, but in important to remember no matter where you are adding event listeners.

### Inside of your elements

When adding event listening inside of your components, assuming you are using `lit-html` (or any other declarative renderer with event binding syntax) use the tools supplied therein to [add event listeners](https://lit-html.polymer-project.org/guide/writing-templates#add-event-listeners). The reasoning behind this is that for any listener added by `lit-html`, the same listener will be removed by `lit-html` when no longer needed; no ghost listeners! That means whether the DOM and its associated listener is available for the entire lifecycle of your application, or just for a small part of that, the least amount of work will be done to ensure the event is handled appropriately. See the `click` listener in the following code. It _only_ exists while `this.open` is `true`, which leaves the browser listening to fewer things and your code less likely to trigger handlers errantly.

```js
render() {
    return (
        this.open
        ? html`<button @click=${this.handleClose}>Close</button>`
        : html``
    );
}
```

A side benefit of relying on the `@event` syntax in `LitElement` (if you use it) is that all events handled therein are automatically bound to `this` which will prevent the need to do so manually: no `this.handleClose = this.handleClose.bind(this);` and, no `handleClose = (event) => {}` in the case above.

### On your elements

If you are adding a listener to your element, from inside your element, you should add that listener in the `constructor`. The browser does a great job of garbage collecting that listener when the element is removed from the DOM, so there is no reason to do any work to manage that yourself. See the following example where the element listens for a `done` event.

```js
constructor() {
    super();
    this.addEventListener('done', this.handleDone);
}
handleDone(event) {
    this.done = true;
    // Do the work you'd like to complete when "done" here.
}
```

Side note: as long as your event handler is a method of your custom element, there is no need to manually `bind` it. When calling `addEventListener`, the value of `this` inside the event handler [is a reference to the element](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#The_value_of_this_within_the_handler).

### On elements outside of your element

In some cases, you will need to add an event listener to elements outside of the element you are building: e.g. a `resize` listener of the `window`. When doing so, the `window` could last well beyond the last reference to your element and it is very important that you do the work to ensure that the listener is added and removed appropriately. Thankfully, the custom elements specification outlines the [`connectedCallback` and `disconnectedCallback` lifecycle methods](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks). These are the perfect hooks for managing these sorts of listeners. When adding event listeners to this sort of external element, use the `connectedCallback`, like so:

```js
constructor() {
    super();
    this.handleResize = this.handleResize.bind(this);
}
connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    window.addEventListener('resize', this.handleResize);
}
handleResize(event) {
    // Do something with the resize event here.
}
```

Ensuring that event listeners do not stick around beyond the presence of your element in the DOM fits neatly into the `disconnectedCallback` method:

```js
disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
    super.disconnectedCallback && super.disconnectedCallback();
}
```

Side note: again, as you will be adding this listener manually, you _will_ need to ensure that `this` is bound to your liking. See the `.bind()` syntax above. When removing event listeners is it important to ensure that the identity of the callback bound to the event is available by reference. See how the example above achieves this by assigning the bound version of `handleResize` to itself before adding/removing the listener.

## Event dispatching

### Keep it simple

You can dispatch a DOM event on any element in your application with `el.dispatchEvent(new Event('event'))`. With just that amount of code, you'll be able to trigger the callback for any listener for that event name that is bound to that element. You'll also trigger the callback on any ancestor elements in the same DOM tree for listeners bound to the "capture" phase of an event. In a lot of cases this might be all of the functionality you really need when dispatching an event, so compare your usage needs before worrying too much about the following.

### Know your options

If you want to be able to listen for the event on ancestor elements during the "bubble" phase you'll need to manage the `bubbles` property of the event, like so:

```js
el.dispatchEvent(
  new Event('event', {
    bubbles: true,
  }),
);
```

During the "bubble" phase an event travels element by element from the dispatching element up to the top of the current DOM tree. Often, `bubbles` is used to make your event available to ancestor elements, however, it isn't required to do so. During the "capture" phase, which occurs before the "bubble" phase the event will travel element by element down from the top of the current DOM tree, making the event available to those elements. However, listening to events on the "capture" phase can sometimes be confusing, involve extended techniques to add in declarative templating, and require extended documentation. In this way, the least work approach says using `bubbles` is a good idea and in cases where you do not, it is important to what you are committing to in choosing to make "capture" phase events a part of your element's API.

If you'd like your event to be able to travel across shadow DOM boundaries, and begin its `capture` phase at the `window`, you'll need to manage the event's `composed` property, a la:

```js
el.dispatchEvent(
  new Event('event', {
    composed: true,
  }),
);
```

Be aware that a `composed` event will be retargeted to each shadow root that it passes through. In this way, the value for `event.target` will be the first of an element with a shadow DOM or the dispatching element as you travel from the listening element towards the dispatching element. This is one way in which a shadow root provides encapsulation for the inner working of your element. If you ever need the entire path across the DOM that your event will take you can use the `event.composedPath()` method to acquire an array of elements (starting with the dispatching element) that the event will pass through.

With both of these properties managed, your event will both begin its `capture` phase at the `window` as well as a `bubble` phase which ends at the `window`. In this case, your event will look like the following:

```js
el.dispatchEvent(
  new Event('event', {
    bubbles: true,
    composed: true,
  }),
);
```

Remember to be conscious of your use of `composed: true`. When using `composed`, all parent components and implementors will also have access to your event in both phases, which can lead to event pollution. Only use these settings when you mean for the entire application to have access to an event.

## Even more data

When you'd like to pass data along with your event, you have two options: dispatch a `new CustomEvent()` or extend the `Event` class. While no native DOM element uses the `CustomEvent` constructor to create the events that they dispatch, developers are offered this constructor and its additional `detail` property as a way to pass additional information along with their event. This can be done like so:

```js
el.dispatchEvent(
  new CustomEvent('custom-event', {
    detail: 'Your details here',
  }),
);
```

In this way, any listener would also access to the value of `event.detail` in its callback method. While `event.detail` isn't directly writable after you also created the event, you can set it to a mutable value so that listeners can also pass data back to the dispatching element.

```js
parent.addEventListener('custom-event', event => {
  event.detail.wasHeard = true;
});

const customEvent = new CustomEvent('custom-event', {
  detail: {
    wasHeard: false,
  },
});
el.dispatchEvent(customEvent);
console.log(customEvent.detail.wasHeard); // true
```

Developers may also access the `Event` constructor which can be extended to contain not only data but functionality, as well.

```js
class MyEvent extends Event {
  constructor(name, options, importantData) {
    super(name, options);
    this.importantData = importantData;
    this.dataReceived = false;
  }
  logImportantData() {
    console.log(this.importantData);
  }
}

parent.addEventListener('custom-event', event => {
  event.logImportantData();
  event.dataReceived = true;
});

const customEvent = new MyEvent(
  'custom-event',
  {
    bubbles: true,
  },
  'Something important',
);
console.log(customEvent.dataReceived); // false
el.dispatchEvent(customEvent); // Something imporant
console.log(customEvent.dataReceived); // true
```

An additional benefit of extending the `Event` class is the ability to do `instanceof` checking in your listener. This can be a great way to disambiguate one `custom-event` from another `custom-event`.

```js
parent.addEventListener('custom-event', event => {
  if (event instanceof MyEvent) {
    console.log('do something for real');
  }
});
```

In the odd case where you need to use a lot of `composed` events of the same name, or are implementing 3rd-party elements that do, you can be sure that none of them step on the listeners intended for other events by leveraging this sort of check to confirm that they are uniquely the event you intend to respond to in your listener.
