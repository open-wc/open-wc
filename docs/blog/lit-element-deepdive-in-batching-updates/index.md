## Introduction

[LitElement](https://lit-element.polymer-project.org/) is a base class for developing web components. It's very small, efficient at updating, and takes a lot of the heavy lifting of writing web components out of the developers hands, by being lazy (or: efficient).

Some questions that I often get during workshops, or from new colleagues who have just started working with LitElement are:

- How exactly does LitElement achieve its efficient updates?
- What does asynchronous rendering mean?
- How does LitElement pick up property changes?

So I figured, _it's blog time!_

Lets start by taking a look at the following code example:

```js
class MyElement extends LitElement {
  foo() {
    this.myPropertyA = 1;
  }
}
```

LitElement is _reactive_ and _observes_ your properties to kick off what is known as its "render pipeline". What this means is that whenever we change a property in our component, it'll update and re-render the component. This is nice, because it means we don't have to do anything manually. In the code example above, just the act of setting a new value to `this.myPropertyA` will cause our component to re-render.

Now consider another example:

```js
class MyElement extends LitElement {
  foo() {
    this.myPropertyA = 1;
    this.myPropertyB = 2;
  }
}
```

Hrm. Looks like we're in a bit of a pickle here. When should we re-render? Should we re-render after `myPropertyA` has been set? That would mean we might do a bunch of unnecessary work and rendering, because we also want our component to update when we set `myPropertyB`, so we'll end up with two renders, where one would have been sufficient. That doesn't sound very efficient. This would get out of hand really quickly if we'd have a lot more properties to set in a method.

Fortunately, LitElement is smart and lazy, and uses a clever technique to _batch_ these updates, and only re-render _once_. In order to understand how all this works, we're going to take a look at some popular batching patterns, dive into the event loop, and the internals of LitElement. Finally, we'll write a naive implementation of a batching web component base class.

## Batching

Before we get started, lets make clear what we actually mean when we talk about _batching work_, and go over a couple techniques to demonstrate how we can achieve batching behavior in JavaScript.

Batching is basically limiting the amount of work we need to do, and is often implemented as a performance measure. A popular usecase for batching, or limiting work, is limiting API calls that may get fired in quick succession for example. We don't want to put any unnecessary load on the API, and do a bunch of wasteful requests. Or in the case of LitElement; efficiently limiting re-renders of our components. Remember; the goal is to avoid _any_ unnecessary work in order to be performant.

A popular pattern for batching is using a debounce function. As mentioned above, debouncers are often used for batching API calls. Imagine we have a search input, that every time a new search keyword is entered, fetches some search results from a server. It would put a pretty heavy load on the API if we would fire a request for every single input change or every new character, and that can be pretty wasteful. Instead, we can _debounce_ the API calls, to only actually fire a request on the _last_ input change.

Consider the following example:

```js
/* This is generally what a debounce function looks like, it takes a function to execute, and optionally a delay */
function debounce(func, delay = 0) {
  /* We create a variable to store a reference to the last `setTimeout` */
  let timeoutId;

  /* And then we return a new function, that whenever called, clears the latest timeout, essentially cancelling it, and schedules a new timeout */
  return function () {
    /* Because this function closes over the outer function, we'll still have access to the `timeoutId` declared above. This is useful on subsequent calls to the 'inner' function. */
    clearTimeout(timeoutId);

    /* We then schedule a new timeout, that calls the function that we'd like to execute */
    timeoutId = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

function search() {
  /* Do some API call to get more search results */
}

/* We create a new variable that stores the _returned_ function from the debounce function */
const debouncedSearch = debounce(search, 500);
input.addEventListener('input', debouncedSearch);
```

If the user types the search keyword "javascript" in the input, instead of firing 10 API requests (one request for every character in the word "javascript"), we only fire one request; when the user has finished typing.

> If you're interested in reading more about debouncing, here's a great blog on [css-tricks.com](https://css-tricks.com/debouncing-throttling-explained-examples/)

However, and I’m sorry to disappoint, this is not how LitElement does things but important to illustrate the point of "batching". Before we go deeper into that, we’re going to require some knowledge about...

## THE EVENT LOOP!

The event loop... can be a pretty elusive subject to understand. I'll try to keep it brief here with a basic example, but if you're interested in learning more about how the event loop works, here are some incredible resources that I cannot recommend enough:

- [Tasks, Microtasks, Queues and Schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) by [Jake Archibald](https://twitter.com/jaffathecake)
- [In The Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0) by [Jake Archibald](https://twitter.com/jaffathecake)
- [JavaScript Visualized](https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke#tasks) by [Lydia Hallie](https://twitter.com/lydiahallie)

Fortunately, where we're headed, we don't need to understand all the ins and outs of the event loop, we're really only interested in _microtasks_ for our case. Consider the following piece of code (... that often does the rounds on Twitter polls, and has confused many a developer before). What do you think is the order the `console.log` statements are called?

```js
console.log(1);

Promise.resolve().then(() => {
  console.log(2);
});

console.log(3);
```

Here's the answer, the order of the resulting console logs of this code is:

```js
// 1
// 3
// 2
```

We'll have [Jake Archibald](https://twitter.com/jaffathecake) explain to us why exactly this happens:

> The microtask queue is processed after callbacks as long as no other JavaScript is mid-execution, and at the end of each task. Any additional microtasks queued during microtasks are added to the end of the queue and also processed.

If we go back to our code snippet, we can see that the following happens:

- `console.log(1);` is called, and logged to the console
- We schedule a new _microtask_ with `Promise.resolve().then(() => {})`, but at this point in time, JavaScript has not finished executing; it's not time to actually process microtasks just yet
- JavaScript continues executing code, because we're not done yet
- `console.log(3);` is called, and logged to the console
- JavaScript has finished executing! The browser can now process any microtasks we may have
- `console.log(2);` is called, and logged to the console.

So why is this important? How does this allow us to use microtasks to _batch_ work? Let's take a look at a practical example:

```js
class Batching {
  /* We declare and initialize a variable to keep track of whether or not an update has already been requested */
  updateRequested = false;

  scheduleUpdate() {
    /**
     * In here, we need a check to see if an update is already previously requested.
     * If an update already is requested, we don't want to do any unnecessary work!
     */
    if (!this.updateRequested) {
      /* If no update has yet been requested, we set the `updateRequested` flag to `true` */
      this.updateRequested = true;

      /**
       * Since we now know that microtasks run after JavaScript has finished
       * executing, we can use this knowledge to our advantage, and only set
       * the `updateRequested` flag back to `false` again once all the tasks
       * have run, essentially delaying, or _batching_ the update!
       */
      Promise.resolve().then(() => {
        this.updateRequested = false;
        this.update();
      });
    }
  }

  /* This is our `update` method that we only want to be called once */
  update() {
    console.log('updating!');
  }
}

const batching = new Batching();

/* We call scheduleUpdate in quick succession */
batching.scheduleUpdate();
batching.scheduleUpdate();
batching.scheduleUpdate();

/* 🎉 The result: */

// "updating!"

/* `update` only ran once! */
```

Essentially, `scheduleUpdate` guards the `update` function against multiple incoming calls with its `if` statement. This cleverly uses our newfound knowledge of microtasks to our advantage to process any other incoming calls _first_. `update` only gets called once JavaScript has finished executing and microtask processing begins.

As a fun tidbit of knowledge, we can also write the `scheduleUpdate` method like so:

```js
class Batching {
  // ...

  async scheduleUpdate() {
    if (!this.updateRequested) {
      this.updateRequested = true;
      this.updateRequested = await false;
      this.update();
    }
  }

  // ...
}
```

Since, from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await):

> If the value of the expression following the await operator is not a Promise, it's converted to a resolved Promise.

In other words, once we set `updateRequested`, we don't immediately unset it, the `await` keyword ensures that we only _schedule_ it to be unset.

In fact, [Justin Fagnani](https://twitter.com/justinfagnani), one of the authors of LitElement, once told me on twitter that the pre-LitElement version did exactly this:

![twitter screenshot](https://miro.medium.com/max/700/1*0L5H_ZGictCOzj01DVBjdg.png)

### Deferring promises

Alright, we're almost ready to explain how LitElement achieves its efficient updates. But before we go there, there's one final concept we need to explore, and that's deferring resolving of Promises, which will provide us with a handy utility later on in this blog post.

Take a look at the following code:

```js
/* We declare a new variable */
let resolveFn;

/**
 * We declare a new promise, but we _dont_ resolve it!
 * Instead, we assign the `resolve` function to the
 * `resolveFn` that we declared above
 */
const myPromise = new Promise(resolve => {
  resolveFn = resolve;
});

/**
 * `myPromise` now is just a pending promise, waiting to be resolved,
 * and we can do that whenever we please with our `resolveFn`
 */
myPromise; // Promise {<pending>}

/* For example, we could do a whole bunch of other work in between */

/* And finally, whenever we're ready, we can call the `resolveFn` to resolve `myPromise` */
resolveFn(); // Resolves `myPromise`

/* Aaand `myPromise` is now fulfilled! */
myPromise; // Promise {<fulfilled>: undefined} ! 🎉
```

This pattern is often used in cases (like unit tests) where you have to await a specific amount of time before continuing.

```js
function sleep(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

(async () => {
  await sleep(1000); // Awaits one second for the timeout to execute before continuing
})();
```

In this example, the `sleep` function returns a new `Promise`. Inside the promise, we set a timeout, but we only resolve the promise once the `setTimeout` callback is executed. So by `await`ing the `sleep` function, we essentially force to wait until `setTimeout` callback has executed.

Be aware, however, that JavaScript is single-threaded, and blocking the main thread is generally considered a bad practice.

## Back to LitElement

### 🧙‍♂️ Automagically requested updates

LitElement is _reactive_. What this means is that, like many other modern frontend libraries, we dont have to worry as much about manually rendering or re-rendering the contents of our component. All we have to do as a user of LitElement is declare our properties, LitElement will then _observe_ these properties for us, and when a property has changed LitElement takes care of updating our component for us. Nice. I like not doing work.

![counter component](https://miro.medium.com/max/616/1*s10tsVCzdDp0TPsW9Agf9A.png)

> Simple counter element, courtesy of the lovely folks over at [webcomponents.dev](https://webcomponents.dev)

Imagine we have a simple counter element that has a `count` property. All thats needed for LitElement to rerender, is set a new value to the `count` property like so: `this.count = 1;`. This will automagically cause LitElement to request an update.

But... how? How does LitElement know that the `count` property was set? How does it _observe_ our properties?

LitElement requires users to declare the properties of their component in a _static properties getter_. This static properties getter is very, very useful, because it takes a lot of boilerplate out of the developers hands, it takes care of attributes for us, handles attribute reflection, allows us to react to changes, but more importantly: It creates getters and setters for us. This is nice, because this means that our components dont get littered with getters and setters all over the place, but it also requests updates for us!

Consider the following example:

```js
class MyCounter extends LitElement {
  static get properties() {
    return {
      count: { type: Number },
    };
  }
}
```

Under the hood, LitElement essentialy turns this into the following getters/setters:

```js
class MyCounter extends LitElement {
  set count(value) {
    this.__count = value;
    this.requestUpdate(); // ❗️ (metal-gear-solid-alert.mp3)
  }

  get count() {
    return this.__count;
  }
}
```

> Note: this is pseudocode for illustration purposes, the actual source code of LitElement looks a little bit different, but the general concept still applies. If you're interested in reading the source code, you can find it [here](https://github.com/Polymer/lit-element/blob/master/src/lib/updating-element.ts#L361).

What this means is that whenever we assign a new value to a property like so: `this.count = 1;`, the setter for `count` is called, which then calls `requestUpdate()`. So by simply setting a property, an update is requested for us!

### Objects and arrays

We'll take a small aside here to explain another common occurence when using LitElement, that I often see people get confused about. We now know that we can trigger updates simply by setting a new value to a property, but... what about objects and arrays?

Imagine we have a component with a `user` property that looks something like this:

```js
{
  name: "Mark",
  age: 30
}
```

People often expect that setting, for example, the `name` property on the `user` object should trigger a rerender, like so: `this.user.name = "Nick";`, and are surprised to find that it _doesn't_. The reason for this is that by setting the `name` property of the `user` object, we don't actually change the `user` object itself, we changed a _property_ of the `user` object, and as such, the `this.requestUpdate()` method is never called!

An easy fix for this is to just call `this.requestUpdate()` manually, or alternatively replace the entire object to make sure the setter _does_ get called:

```js
this.user = {
  ...this.user,
  name: 'Mark',
};
```

The same is true for arrays. Imagine we have a `users` property on our element, that contains a list of users similar to the object we used in the example above. The following code will _not_ schedule an update:

```js
this.users.push({ name: 'Nick', age: 30 });
```

Because we only mutate the already existing array, and as such don't trigger the setter for the `users` property itself.

## Back to batching updates

Alright, we now know what batching means, how microtasks work, how we can defer resolving promises, and how setting properties in LitElement schedules an update. We have all the required knowledge to figure out how LitElement actually uses this to _batch_ its updates.

To do so, we're going to write a very naive implementation of this behavior. We're going to start with a very simple JavaScript class that efficiently calls an `update` method when our properties change. Follow along:

```js
/* We create a new class ... */
class Batching {
  /* ... that has a `requestUpdate` method */
  async requestUpdate() {
    /**
     * In here, we need a check to see if an update has already previously been requested.
     * If an update is already requested, we don't want to do any unnecessary work!
     */
    if (!this.updateRequested) {
      /**
       * If no update was previously requested, we set this
       * flag to `true` to avoid doing unnecessary work in
       * case `requestUpdate` might get called another (or several) times
       */
      this.updateRequested = true;

      /**
       * ... and _this_ is where the magic happens;
       * This schedules a microtask that executes once JavaScript has
       * finished executing, and since we guard against any other
       * incoming calls for `requestUpdate`, we only do work once
       */
      this.updateRequested = await false;

      /* Finally, we call our `update` method, which can then render some DOM, or do whatever */
      this.update();
    }
  }

  update() {
    console.log('updating!');
  }

  /**
   * For demonstration purposes we add some setters here,
   * that when given a new value, will request an update
   */
  set a(val) {
    this.__a = val;
    this.requestUpdate();
  }

  set b(val) {
    this.__b = val;
    this.requestUpdate();
  }
}

/* We instantiate a new instance of our class */
const batching = new Batching();

/* And we set multiple properties */
batching.a = 1;
batching.b = 2;

/* 🎉 The result: */

// "updating!"
```

> You can see a live demo of this in your browser [here](https://thepassle.github.io/batching-blog/snippets/simple-batching.html)

### Taking things a step further

Neat! We now have a simple implementation of batching updates. We can now take things even further and provide some kind of API so users can `await` updates, like LitElement's `updateComplete` property. Take a look at the following code:

```js
class Batching {
  constructor() {
    /**
     * We initialize an `updateComplete` property with a new
     * Promise that we'll only resolve once `this.update()`
     * has been called
     */
    this.updateComplete = this.__createDeferredPromise();
  }

  async requestUpdate() {
    if (!this.updateRequested) {
      this.updateRequested = true;
      this.updateRequested = await false;
      this.update();

      /* When our update is, in fact, complete we resolve the Promise that was assigned to the `updateComplete` property ... */
      this.__resolve();

      /* ... And we assign a new promise to updateComplete for the next update */
      this.updateComplete = this.__createDeferredPromise();
    }
  }

  update() {
    console.log('updating!');
  }

  /**
   * Creates a new deferred promise that we can await,
   * and assign the `resolve` function to `this.__resolve`,
   * so we can resolve the promise after we call `this.update()`
   */
  __createDeferredPromise() {
    return new Promise(resolve => {
      this.__resolve = resolve;
    });
  }

  set a(val) {
    this.__a = val;
    this.requestUpdate();
  }

  set b(val) {
    this.__b = val;
    this.requestUpdate();
  }
}

/* We use an Async IIFE (Immediately Invoked Function Expression), because top-level await is not a thing yet 😑 */
(async () => {
  /* We instantiate a new instance of our class */
  const batching = new Batching();

  /* Set multiple properties in a row */
  batching.a = 1;
  batching.b = 2;

  /* And this is where we `await` an update */
  await batching.updateComplete;

  /* We then assign another property */
  batching.b = 3;

  /* 🎉 The result: */

  // "updating!"
  // "updating!"
})();
```

> You can see a live demo of this in your browser [here](https://thepassle.github.io/batching-blog/snippets/simple-batching-update-complete.html)

## Back to web components land

Sweet, now that we have a solid understanding of using microtasks to our advantage to batch work, let's go back to web components land, and see how we could implement this as a simple base class for web components.

```js
/* We create a new class that extends from the native HTMLElement */
class BatchingElement extends HTMLElement {
  constructor() {
    /* We now have to call `super` to make sure our element gets set up correctly */
    super();
    this.updateComplete = this.__createDeferredPromise();
  }

  async requestUpdate() {
    if (!this.updateRequested) {
      this.updateRequested = true;
      this.updateRequested = await false;
      this.update();
      this.__resolve();
      this.updateComplete = this.__createDeferredPromise();
    }
  }

  update() {}

  __createDeferredPromise() {
    return new Promise(resolve => {
      this.__resolve = resolve;
    });
  }
}
```

> Again, this code is a simplified example of the technique LitElement uses for illustration purposes, if you're interested in seeing how LitElement achieves this exactly, you can find the source code [here](https://github.com/Polymer/lit-element/blob/master/src/lib/updating-element.ts#L715).

And, well, that's it. Not much has changed here really, other than the fact that we now extend from `HTMLElement`, and have to call `super()` in the constructor. Let's see how we can actually use it in a component:

```js
/* We create a new class, MyElement, that extends from our BatchingElement base class */
class MyElement extends BatchingElement {
  constructor() {
    super();

    /* We attach a shadowRoot to our component for good measure */
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    /* And we call an initial render when our component gets connected to the DOM */
    this.update();
  }

  /**
   * This is our `update` function that will get triggered by the
   * `requestUpdate` method.
   *
   * Any time we set a property on this element, we'll also
   * trigger an update.
   */
  update() {
    console.log('updating!');
    this.shadowRoot.innerHTML = `
      <div>value of a: ${this.a}</div>
      <div>value of b: ${this.b}</div>
    `;
  }

  /**
   * And finally, we need some getters and setters to
   * actually be able to trigger updates 🙃
   *
   * Notice how much boilerplate this is, and how nice
   * LitElement makes this for us instead? 😩
   */
  set a(val) {
    this.__a = val;
    this.requestUpdate();
  }
  get a() {
    return this.__a;
  }

  set b(val) {
    this.__b = val;
    this.requestUpdate();
  }
  get b() {
    return this.__b;
  }
}

customElements.define('my-element', MyElement);
```

Neat! We've now implemented our `BatchingElement` base class in a real life web component. Whenever we change multiple properties in a row, we'll only call our `update` method once. Consider the following example:

```js
/* We get a reference to our component, so we can call methods on it */
const myElement = document.querySelector('my-element');

/**
 * We assign multiple properties in quick succession,
 * but our component will still only call `update` once!
 */
myElement.a = 'foo';
myElement.b = 'bar';

/* 🎉 The result: */

// "updating!" -> called in the `connectedCallback` to do an initial render
// "updating!" -> trigger by setting two properties
```

> You can see a live demo of this in your browser [here](https://thepassle.github.io/batching-blog/snippets/base-class.html).

If you're interested in seeing another real world example that implements this pattern, you can take a look at [`@generic-components`](https://github.com/thepassle/generic-components/blob/master/utils/BatchingElement.js), where I use the same pattern to batch calls for the `slotchange` event. The implementation is slightly different, but the same concepts apply.

And thats how LitElement efficiently batches updates and avoids doing unnecessary work. Combine that with [lit-html](https://lit-html.polymer-project.org/) to do efficient DOM updates, and you have a really efficient and powerful combination of libraries at your disposal.

Thanks for reading!
