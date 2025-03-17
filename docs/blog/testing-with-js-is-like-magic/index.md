---
title: 'Testing with JS is like magic, but is it science?'
pageTitle: 'Testing with JS is like magic, but is it science?'
published: true
description: 'Always be aware of who you are testing for, as well as what is real and what is not.'
tags: [webcomponents, javascript, testing, wtr]
date: 2023-09-01
canonical_url: https://open-wc.org/blog/testing-with-js-is-like-magic/
cover_image: /blog/testing-with-js-is-like-magic/images/screenshot.jpg
socialMediaImage: /blog/testing-with-js-is-like-magic/images/screenshot.jpg
---

If that title doesn't get you riled up, I know what will...

# Last time on "Testing Web Components"

That's right, a recap!

If you haven't read the first installment of [Testing Web Components with @web/test-runner](https://dev.to/westbrook/testing-web-components-with-webtest-runner-51g6), go do it now... I'll wait... If you just did, or you had previously, here are some fun things to have at the top of your mind before digging into today's episode:

- you can quickly generate a new web component repo with [Open-WC](https://open-wc.org/guides/developing-components/getting-started/)
- the generator has a whole lot of options, but specifically, we're cooking with "Testing ([web-test-runner](https://modern-web.dev/docs/test-runner/overview/))" and Typescript
- the web component generated thereby is powered by [Lit](https://lit.dev/) and leverages many of its [decorators](https://lit.dev/docs/components/decorators/)
- by default, it tests a few things intrinsic to the generated element, but mostly you'll be replacing that functionality with your own

...and that's where we come in!

# Testing with JS

I can hear you now:

> What do you mean, all of my JS tests are in JS, what's so magic about it?

To which I'd respond, with a voice of disbelief, "You're testing JS with JS, what _isn't_ magic about it?"

Then I'd remember that if you lived in my head already and knew all the jokes, you'd likely not be reading by this point. But, you're here, so I'll point out that I'm not talking about "magic"; that amazing, powerful stuff of lore that saves the heroine in your favorite story. I'm talking about "magic"; the thing that isn't real. Yes, testing your JS with JS isn't real. Or, it isn't real for at least half of your consumer types, which _likely_ represent an overwhelmingly large percentage of your actual consumers. That is the consumers that actually visit the page or application that you are building.

To understand what I mean, let's revisit one of the tests that we've been bequeathed by the [Open WC Generator](https://open-wc.org/guides/developing-components/getting-started/#generator).

```ts
it('increases the counter on button click', async () => {
  const el = await fixture<TestingComponents>(html`<testing-components></testing-components>`);
  el.shadowRoot!.querySelector('button')!.click();

  expect(el.counter).to.equal(6);
});
```

In this test, we confirm that "clicking" the `<button>` within the shadow root of the `<testing-components>` element causes the `counter` property on our element to equal `6`.

This is an extremely common approach to interacting with the UI at unit testing time with JS.

## Interacting with the UI

[`.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click) is a powerful part of the web API. It allows a developer to "simulate" the `click` segment of a pointer interaction (possibly the most common segment) from the JS context. In this way, it can be a great way to guarantee the developer API that you surface with code.

However, it's not _real_.

How do I know it's not real? Well, when was the last time you saw a visitor to your site or application type `el.click()` into the console of their browser's DevTools? You, me, and our developer friends at debug time don't count here!

This is a version of what's called "mocking". Mocking can be an important part of unit testing as it allows you to isolate the unit under test. This means that you can ignore inputs, side effects, and other realities applied to your unit by other contexts when testing that unit. When testing UI interactions, whether and how to mock the human that will be interacting with your UI will always be important to work out.

Some [testing libraries](https://testing-library.com/) look to mitigate this by [more expansively mocking the interaction](https://github.com/testing-library/user-event/blob/main/src/pointer/index.ts#L67-L111). You should definitely spend some time deciding whether the work going on here is something you think your testing needs, but, in a quick overview, some of the things being handled here are:

- possibly moving the pointer
- deciding whether the pointer should be released before starting a new interaction
- pressing down the pointer on a new (or the last) position
- possibly releasing the pointer again
- managing interaction with the "carat", which I couldn't 100% tell you what is in this context

Luckily, this complexity is then hidden under [helper methods](https://github.com/testing-library/user-event/blob/main/src/convenience/click.ts#L4-L12) because no one will remember to do all this _every_ time they want to better mimic a `.clock()`.

> Is there something better?
> — exasperated unit tester

Well, [`@web/test-runner`](https://modern-web.dev/docs/test-runner/overview/) offers a [Commands API](https://modern-web.dev/docs/test-runner/commands/) that supports you making requests to the browser runner of your tests from the JS test context. At a high level, this means that you can ask the browser runner (e.g. Playwright, Selenium, etc.) that you leverage at test time to act on the test context as if it actually were a person interacting with the page. By doing so, you can trigger things like:

- pointer interactions (hello, `.click()`, but better!)
- keyboard interactions
- interact with `<select>` menus (their default UI is outside of the browsing context)
- resize the window
- and, more!

For a `.click()`, this looks a bit like the following:

```ts
await sendMouse({ type: 'move', position: [x, y] });
```

Looks pretty awesome, right? Well, that's not what we're going to be diving into today, sorry. In the next couple of installments, we'll take deeper looks at a number of these commands, and how you can write your own!

For today, we're going to dive into the developer API that your newly generated custom element surfaces, _and you're gonna like it_.

## Interacting with the developer API

As mentioned above, `.click()` is one way to surface interactions on your element to your developer consumers. In that way, this test _could_ be 100% real, and actually magic (the amazing kind). In this context, however, it's not.

The offending code in this case is `.shadowRoot!`. While `.click()` can be a powerful API for consuming developers, if you're testing such an API on an element that a developer shouldn't have access to (any in the shadow DOM), then it's not real.

[Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) on an element encapsulates the contents of that shadow root from selectors from the parent application or component. This is why we can't use `el.querySelector` directly to access this button. Not being able to do so, means that a consuming developer will not be able to do so as well. So, while reaching through the `.shadowRoot!` may be a way to complete the coverage play of a component's unit tests, it's not something that actually guarantees actual API that any of your consumers would actually leverage.

With this in mind, our test development cycle might go one of a couple of different ways. You could:

- say, "Output says the lines are covered, I'm going home", and you'd not be wrong.
- leverage the [commands](https://modern-web.dev/docs/test-runner/commands/) from above and close over the API to external developers by only testing as a visitor and not as a developer consuming your component.
- or, start a refactor party and look at what would be needed to make this API available to a developer.

Before you take the path of most resistance, ask yourself "As a developer would I want this capability to be surfaced in some way?". If the answer is "yes", then hopefully wanting it points you towards a path of _how_ you'd want it surfaced, but if not, keep reading for some thoughts on what that might mean.

### The developer API

Sometimes a developer API is already available on the surface of your custom element, you just have to hold it right. Let's revisit our test to see if that might be appropriate here:

```ts
it('increases the counter on button click', async () => {
  const el = await fixture<TestingComponents>(html`<testing-components></testing-components>`);
  el.shadowRoot!.querySelector('button')!.click();

  expect(el.counter).to.equal(6);
});
```

What does "increases the counter on button click" mean, again:

1. we load the element
2. we find and click the button
3. the counter equals `6`

Ignoring for the moment the lack of precision as to how much the counter is increased, or coverage of what the counter should be by default (that's technically addressed in a previous test in our generated code), the operative word here is that a button clicked increases the `counter`. This test is 100% for end consumers of your element. What might it be called if we were testing these capabilities for a developer consumer?

- `counter` can be set?
- `counter` can be increased?
- element can be clicked?
- something else?

Let's look at how we might build these tests and refactor our element to support them.

#### `counter` can be set

```ts
it('`counter` can be set', async () => {
  const el = await fixture<TestingComponents>(html`<testing-components></testing-components>`);
  el.counter = 6;

  // This isn't really a test of the side effects of the counter being set, so wouldn't be my first choice.
  expect(el.counter).to.equal(6);
});
```

This test confirms that not only is `counter` a getable property as confirmed in 'has a default title "Hey there" and counter 5' and the original version of 'increases the counter on button click', but it is also settable. Being this property leverages the [`@property` decorator](https://lit.dev/docs/api/decorators/#property) from [Lit](https://lit.dev), I can tell you for sure that it does have a setter, though our tests certainly hadn't guaranteed that previously. So, we'd be adding robustness to the generated code if we chose to add something like this. I would say that testing a setter with its getter _might_ leave something to be desired. Once we get deep into them in subsequent articles, confirming that the new value of `counter` is leveraged by the rendered DOM via [snapshot testing](https://modern-web.dev/docs/test-runner/commands/#snapshots) (not my favorite, I'll share more about that later) or actually rendered to the page via [visual regression testing](https://github.com/modernweb-dev/web/tree/master/packages/test-runner-visual-regression) (key for UI libraries) would be a valuable extension of the test here.

#### `counter` can be increased

```ts
it('`counter` can be increased', async () => {
  const el = await fixture<TestingComponents>(html`<testing-components></testing-components>`);
  // The API doesn't currently exist on the element but could be surface as a public method for developers and leveraged within the click callback.
  el.increaseCounter();

  expect(el.counter).to.equal(6);
});
```

"Increased" here is playing fast and loose with the context of the original test. "increases the counter", as the only spec for the element, implies (in a way that is played out in the definition of the custom element) that you can only _increase_ the value of `counter`. If this were true, I might also suggest you cover over the setter of `counter` to prevent developer consumers from _decreasing_ the value of `counter`. For now, we'll just go with increasing being the only thing we can do.

Based on this assumption, the right thing might be just to surface the internal `__increment()` method in a public manner. For brevities sake, we could rename it `increaseCounter`, as seen in the test:

```diff
-   __increment() {
+   increaseCounter() {
```

Then we'd refactor the click handler to leverage the same:

```diff
-       <button @click=${this.__increment}>increment</button>
+       <button @click=${this.increaseCounter}>increment</button>
```

And, then we'd be back to passing tests.

#### element can be clicked

Rather than requiring a consuming developer to find a _specific_ element to click on, where you are sure that this was the only clickable functionality in your element, you might be better off by surfacing a custom `click()` method directly on your custom element. This can be tested as follows:

```ts
it('element can be clicked', async () => {
  const el = await fixture<TestingComponents>(html`<testing-components></testing-components>`);
  // This API is also not currently available, but by abstracting the idea of what clicking the element does you may be setting down a path where it does many things.
  el.click();

  expect(el.counter).to.equal(6);
});
```

The refactor to make this possible is only a few steps in this case:

- add the `click()` method
- on, just one step, I guess

```diff
+   click() {
+     this.__increment();
+   }
```

Ship it!

This means that you are binding your custom element to a singular action at `click` time, so be sure this is what is actually intended for the functionality that you are shipping, but, if so, you're on your way to version 1.0!

#### something else

All of these, and more, could serve your developer consumers by ensuring the API contract that you surface to them at unit test time. Within each is a sea of nuance that can be navigated more appropriately with the deeper knowledge of your goals that only you can bring to the discussion.

- Should your custom element support the https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md as a path to developer interaction?
- Should a more proprietary state interface be surfaced? Web components and Lit pair quite nicely with popular projects like [Mobx](https://github.com/adobe/lit-mobx), [Redux](https://github.com/Polymer/pwa-helpers/blob/master/src/connect-mixin.ts), [XState](https://github.com/statelyai/xstate/pull/2581), and on and on.
- Should you devise a purpose-built custom events API for orchestrating imperative cross-DOM interactions? (Probably not..but, you could.)
- Should a similar approach to `increaseCounter()` above be leveraged against a more specific method name clarifying the internal reaction to the state change?

Only you can answer these questions. However, what's great about code is that if you can imagine it then with the right amount of time you can code it, so go wild!

# Being less "magic" and more "amazing"

Focusing your approach to testing on how the actual consumers of your code will interact with that code is an important part of ensuring that the work you do is less magic (the not real kind). The less magic in your tests, the more predictable your work will become. Contrary to popular belief shipping simple, dependable, well-tested features is much more amazing for you consumers than something that could disappear right in front of them.

Above we've learned about some refactoring strategies that our testing cycle can point us towards as we work to make our API contracts simpler, more dependable, and more likely to support our developer consumers to amazing results. Next time, we'll get back to our UI-first consumers and how we can better embody them at test time, as well. Specifically, we'll focus on the [Commands API from @web/test-runner](https://modern-web.dev/docs/test-runner/commands/) and ways to more accurately mock pointer interactions with your code. See you then!
