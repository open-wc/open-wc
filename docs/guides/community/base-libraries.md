# Community >> Base Libraries ||20

You can write web components using just the basic web component APIs. This can be a great choice when you're looking to keep dependencies low. But generally, we recommend using lightweight libraries to help improve the developer experience and reduce boilerplate.

We recommend [lit-html](https://www.npmjs.com/package/lit-html) with the [lit-element](https://www.npmjs.com/package/lit-element) base class as a general-purpose library for building web components. `lit-html` is feature complete, extremely lightweight and offers a great development experience. Check out the [lit-html page](/developing/lit-html.html) for code examples and more information.

In the code snippets throughout our documentation, we use `lit-html` and `lit-element`, but our recommendations and tools are not specific to them. You should be able to use them with any web component library that follows browser standards. If you do run into issues or have any questions, let us know about it!

### Alternative libraries

Besides `lit-html`, there are other great options available:

- [haunted](https://www.npmjs.com/package/haunted) functional-style web components, with react-like hooks
- [hybrids](https://www.npmjs.com/package/hybrids) another functional web component library
- [SkateJS](https://skatejs.netlify.com/) wraps libraries like react, preact or lit-html in a web component
- [slim.js](https://slimjs.com/) declarative web components
- [stencil](https://stenciljs.com/) web component with typescript and JSX (requires a build step)

## Further reading

See: [awesome lit-html](https://github.com/web-padawan/awesome-lit-html) for a great collection of resources.
