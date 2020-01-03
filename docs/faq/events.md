# Managing events in your custom elements

Events in the DOM can span in complexity from responding to a `click` on a `<button>` element to orchestrating the entirety of an application's logic and state. For some insight on how that spectrum might be possible, take some time to check out [`composed: true` considered harmful?](https://dev.to/open-wc/composed-true-considered-harmful-5g59) for a more complete review of the DOM Events API at large. Get started using events in your web components with the recommendations below.

## Event listening TLDR

- events on DOM elements that you create should be handled via `@some-event` in the template (let `lit-html` do the actual wire-up)
- events on your custom elements should be listened for in `constructor` (no need to clean up - as it will be garbage collected when the last reference the element is removed)
- events on elements outside of scope (ex. `window`) should be listened for in `connectedCallback`, and removed in `disconnectedCallback` (prevents ghost listeners when the element is removed)

## Event dispatching TLDR

- prefer "just" events without `bubble` or `composed` e.g. `new Event('something-happened')`
- when needing data consider extending `Event` or using `CustomEvent`
- use `bubble: true` if a node up the tree needs the event
- retrain from using `composed: true` as it leads to event pollution

## Events Playground

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
