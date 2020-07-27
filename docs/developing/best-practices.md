---
permalink: 'developing/best-practices.html'
title: Best Practices
section: guides
tags:
  - guides
  - guide
---

# Best Practices

If you're using our [linting setup](/linting), you may already follow some Web Component best practices, but unfortunately, linters do not cover everything. On this page, you can find our recommended best practices.

In general, we recommend you read [Custom Element Best Practices](https://developers.google.com/web/fundamentals/web-components/best-practices), and [Guidelines for creating web platform compatible components](https://w3ctag.github.io/webcomponents-design-guidelines/).

<div class="custom-block tip"><p class="custom-block-title">Looking for contributors!</p> <p>We're actively looking to extend this page with common best practices. If you have anything to contribute, please make an issue or a pull request on our <a href="https://github.com/open-wc/" target="_blank" rel="noopener noreferrer">github repository<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg></a>.</p></div>

## Upwards Data

> ⬇️ Properties/attributes down
>
> ⬆️ Events up

Every developer at some point will run into the problem of moving some data upwards to a parent element. While there are many ways to manage state in your application like Redux, or passing down a bound function to a child element to mutate state in the parent, our default recommendation for moving data upwards is simply using events. The benefits of using events are that it's close to the platform, and will always have the same expected behavior across frameworks. You can find a demo of using `CustomEvents` [here](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F12-firing-events.js).

If you find yourself moving a lot of data around, it may be time to look into some state management libraries like [Redux](https://redux.js.org/) or consider some more advanced composition techniques with [slotting](https://webcomponents.dev/edit/collection/fOta0aCFgRQqMtyXJjXT/pNsN9JVAiNHOAHpvkL6c).
