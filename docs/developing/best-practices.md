# Best Practices

If you're using our [linting setup](/linting), you may already follow some Web Component best practices, but unfortunately, linters do not cover everything. On this page, you can find our recommended best practices.

In general, we recommend you read [Custom Element Best Practices](https://developers.google.com/web/fundamentals/web-components/best-practices), and [Guidelines for creating web platform compatible components](https://w3ctag.github.io/webcomponents-design-guidelines/).

::: tip Looking for contributors!
We're actively looking to extend this page with common best practices. If you have anything to contribute, please make an issue or a pull request on our [github repository](https://github.com/open-wc/).
:::

## Upwards Data

> ⬇️ Properties/attributes down
>
> ⬆️ Events up

Every developer at some point will run into the problem of moving some data upwards to a parent element. While there are many ways to manage state in your application like Redux, or passing down a bound function to a child element to mutate state in the parent, our default recommendation for moving data upwards is simply using events. The benefits of using events are that it's close to the platform, and will always have the same expected behavior across frameworks. You can find a demo of using `CustomEvents` [here](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F12-firing-events.js).

If you find yourself moving a lot of data around, it may be time to look into some state management libraries like [Redux](https://redux.js.org/) or consider some more advanced composition techniques with [slotting](https://webcomponents.dev/edit/collection/fOta0aCFgRQqMtyXJjXT/pNsN9JVAiNHOAHpvkL6c).
