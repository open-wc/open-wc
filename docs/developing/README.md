# Developing
The web component ecosystem is evolving fast, with many libraries and solutions appearing. High level frameworks such as [Angular](https://angular.io/guide/elements), [Vue](https://github.com/vuejs/vue-web-component-wrapper) and [Stencil](https://stenciljs.com/) provide solutions which compile to web components.

## Browser standards
We strongly believe that staying close to browser standards will be the best long term investment for your code. It is the basis for all our recommendations, and it means that sometimes we will not recommend a popular feature or functionality. It also means we can be faster to adopt and recommend new browser standards.

## lit-html
While there are other good libraries out there, to get started we recommend using the `lit-html` library with the `LitElement` base class for developing web components.

Check out the official documentation for: [lit-html](https://lit-html.polymer-project.org/) and [lit-element](https://lit-element.polymer-project.org/) or check out our code-samples below.

Follow these steps to get started:
1. Install the required dependencies:
```
npm i -D owc-dev-server lit-element
```

2. Create a `index.html`
```html
<!doctype html>
<html>
  <head>
    <script type="module" src="./my-component.js"></script>
    </head>
  <body>
    <my-component></my-component>
  </body>
</html>
```

3. Create a `my-component.js`
```javascript
import { LitElement, html } from 'lit-element';

class MyComponent extends LitElement {
  render() {
    return html`
      <p>Hello world!</p>
    `;
  }
}

customElements.define('my-component', MyComponent);
```

4. Add start scripts to your `package.json`:
```json
{
  "scripts": {
    "start": "owc-dev-server -o"
  }
}
```

5. Start your app:
```bash
npm start
```

## Examples
A collection of live code samples for `lit-html` and `LitElement` can be found on `Stackblitz`:

* [Basic](https://open-wc-lit-demos.stackblitz.io/basic)
	- [01 Basic setup](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F01-basic-setup.js)
	- [02 Manage properties](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F02-manage-properties.js)
	- [03 Property changes](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F03-property-changes.js)
	- [04 Properties and attributes](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F04-properties-and-attributes.js)
	- [05 Passing properties](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F05-passing-properties.js)
	- [06 Handle events](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F06-handle-events.js)
	- [07 Conditional rendering](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F07-conditional-rendering.js)
	- [08 Repeated templates](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F08-repeated-templates.js)
	- [09 Update arrays and objects](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F09-update-arrays-and-objects.js)
	- [10 Render styles](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F10-render-styles.js)
	- [11 Fetching data](https://stackblitz.com/edit/open-wc-lit-demos?file=01-basic%2F11-fetching-data.js)
* [Intermediate](https://open-wc-lit-demos.stackblitz.io/intermediate)
	- [01 First updated](https://stackblitz.com/edit/open-wc-lit-demos?file=01-intermediate%2F01-first-updated.js)
	- [02 Updated](https://stackblitz.com/edit/open-wc-lit-demos?file=02-intermediate%2F02-updated.js)
	- [03 Lifecycle](https://stackblitz.com/edit/open-wc-lit-demos?file=02-intermediate%2F03-lifecycle.js)
	- [04 Computed properties](https://stackblitz.com/edit/open-wc-lit-demos?file=02-intermediate%2F04-computed-properties.js)
	- [05 Querying dom](https://stackblitz.com/edit/open-wc-lit-demos?file=02-intermediate%2F05-querying-dom.js)
	- [06 Light dom](https://stackblitz.com/edit/open-wc-lit-demos?file=02-intermediate%2F06-light-dom.js)
	- [07 Reflecting attributes](https://stackblitz.com/edit/open-wc-lit-demos?file=02-intermediate%2F07-reflecting-attributes.js)
	- [08 Dynamic repeated templates](https://stackblitz.com/edit/open-wc-lit-demos?file=02-intermediate%2F08-dynamic-repeated-templates.js)
	- [09 Slotting](https://stackblitz.com/edit/open-wc-lit-demos?file=02-intermediate%2F09-slotting.js)
* [Advanced](https://open-wc-lit-demos.stackblitz.io/advanced)
	- [01 Property setter observer](https://stackblitz.com/edit/open-wc-lit-demos?file=03-advanced%2F01-property-setter-observer.js)
	- [02 Until directive](https://stackblitz.com/edit/open-wc-lit-demos?file=03-advanced%2F02-until-directive.js)
	- [03 Template wrapping](https://stackblitz.com/edit/open-wc-lit-demos?file=03-advanced%2F03-template-wrapping.js)
	- [04 Shared templates](https://stackblitz.com/edit/open-wc-lit-demos?file=03-advanced%2F04-shared-templates.js)
	- [05 Shared styles](https://stackblitz.com/edit/open-wc-lit-demos?file=03-advanced%2F05-shared-styles.js)
	- [06 External template](https://stackblitz.com/edit/open-wc-lit-demos?file=03-advanced%2F06-external-template.js)
	- [07 Template factories](https://stackblitz.com/edit/open-wc-lit-demos?file=03-advanced%2F07-template-factories.js)
	- [08 Should update](https://stackblitz.com/edit/open-wc-lit-demos?file=03-advanced%2F08-should-update.js)

## Browser support
Not all browsers adopt new features at the same rate. Depending on your browser support requirement, you might end up using features not yet available everywhere. In this case you will need to set up build tools to run your app during development. See `building` below for more.

## Building
When you are ready to ship your app to production, or when you need to test your app on older browsers, take a look at our [building documentation](/building/) to get you started.

## Further reading
See: [awesome lit-html](https://github.com/web-padawan/awesome-lit-html) for a great collection of resources.
