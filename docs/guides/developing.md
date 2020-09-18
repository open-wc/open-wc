---
title: Developing
pageTitle: Developing
eleventyNavigation:
  key: Developing
  order: 40
---

## Going buildless

Browsers have improved a lot over the past years. It's now possible to do web development without requiring any build tools, using the native module loader of the browser. We think this is a great fit for web components, and we recommend this as a general starting point.

Build tools can quickly add a lot of complexity to your code, and make your code reliant on a specific build setup. We think it's best to avoid them during development, or only add them for light transformations if you know what you're doing.

Read [this article](https://dev.to/open-wc/developing-without-a-build-1-introduction-26ao) to learn more about this approach.

## Development server

We created [es-dev-server](https://open-wc.org/developing/es-dev-server.html) to help developing without build tools.

## Web component libraries

You can write web components using just the basic web component APIs. This can be a great choice when you're looking to keep dependencies low. But generally, we recommend using lightweight libraries to help improve the developer experience and reduce boilerplate.

We recommend [lit-html](https://www.npmjs.com/package/lit-html) with the [lit-element](https://www.npmjs.com/package/lit-element) base class as a general-purpose library for building web components. `lit-html` is feature complete, extremely lightweight and offers a great development experience. Check out the [lit-html page](/developing/lit-html.html) for code examples and more information.

In the code snippets throughout our documentation we use `lit-html` and `lit-element`, but our recommendations and tools are not specific to them. You should be able to use them with any web component library that follows browser standards. If you do run into issues, or have any questions, let us know about it!

### Alternative libraries

Besides `lit-html`, there are other great options available:

- [haunted](https://www.npmjs.com/package/haunted) functional-style web components, with react-like hooks
- [hybrids](https://www.npmjs.com/package/hybrids) another functional web component library
- [SkateJS](https://skatejs.netlify.com/) wraps libraries like react, preact or lit-html in a web component
- [slim.js](https://slimjs.com/) declarative web components
- [stencil](https://stenciljs.com/) web component with typescript and JSX (requires a build step)

## Codelabs

See the [codelabs](/codelabs/) page for step by step tutorials for development.

## Code examples

Check out the [code examples](/developing/code-examples.html) page for a collection of best practices and design patterns.

## Testing

Check out our [testing documentation](/testing/) for help with setting up testing.

## Building

When you are ready to ship your app to production, or when you need to test your app on older browsers, take a look at our [building documentation](/building/) to get you started.

## Further reading

See: [awesome lit-html](https://github.com/web-padawan/awesome-lit-html) for a great collection of resources.
