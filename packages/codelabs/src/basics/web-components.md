# Web Components basics

## Introduction

In this codelab, you will learn the basics of what web components are and how they work.

Web components are a set of low-level browser APIs that allow us to write modular, reusable and encapsulated HTML elements. They are based on web standards, and therefore don't require a lot of complex setup to get started. Web components work in any environment that supports basic HTML and javascript.

The web component APIs align with the way browsers have always worked, so they're pretty low level and imperative. We expect that for most use cases we will still use libraries or frameworks for most projects. But instead of each framework inventing their own component model, they will use the ones baked into the browser instead.

Web components have a multitude of use cases. The most obvious is to use them for UI component libraries, where these UI components can be reused within applications built with different technologies. But you can also use web components all the way up the tree and compose entire applications out of them. Web components are also a perfect fit for static/server-rendered pages, where the components just add interactivity after the initial render.

**What you need:**

- A web browser that supports Web Components: Firefox, Safari, Chrome or any Chromium-based browser.
- Basic knowledge of HTML, CSS, and Javascript.

**What you'll learn**

Browsers are moving pretty fast, adding new APIs all the time. In this codelab you will learn about the three most important ones:

- Custom Elements
- Templates
- Shadow DOM

**How it works**

This codelab will go step by step, explaining each code change. At the bottom of each section, there is a "View final result" button where you can see the final code result you should end up with. The codelab is sequential, results from the previous step carry on to the next step.

At the bottom of each step, there is a final code snippet to make sure you're still on the right track or to help you when you get stuck.

## Setup

You can follow this codelab using anything that can display a simple HTML page. We recommend using an [online code editor like jsbin](https://jsbin.com/?html,output), but you could also create a basic html page using your IDE.

To get started, let's create a basic HTML page:

```html
<!DOCTYPE html>

<html>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>
```

If you run this in the browser and see hello world, you're good to go!

## Custom Elements

First, we will take a look at the most important web component API: custom elements.

Modify your HTML page to wrap the "Hello world" message in an element called `<cool-heading>`:

```html
<cool-heading>
  <h1>Hello world!</h1>
</cool-heading>
```

This isn't any HTML element that the browser knows about. When the browser encounters an unknown HTML tag like our `<cool-heading>`, it will just render it as an inline element and move on. With the custom elements API, we can tell the user what to do with the HTML tag we added.

We need to do this in javascript, so let's add a script tag to our page:

```html
<script>
  // your code will go here
</script>
```

To create a custom element we need a class that extends from `HTMLElement`. This is the base class that powers all native elements as well. Let's go ahead and create a class for our heading element:

```js
class CoolHeading extends HTMLElement {
  connectedCallback() {
    console.log('cool heading connected!');
  }
}
```

After creating our class we can associate it with a tagname by defining it in the custom elements registry. This way, whenever the browser sees a `<cool-heading>` tag, the browser will instantiate and apply our class to the element:

```js
customElements.define('cool-heading', CoolHeading);
```

<details>
  <summary>
    View final result
  </summary>

```html
<!DOCTYPE html>

<html>
  <body>
    <cool-heading>
      <h1>Hello world!</h1>
    </cool-heading>

    <script>
      class CoolHeading extends HTMLElement {
        connectedCallback() {
          console.log('cool heading custom element connected!');
        }
      }

      customElements.define('cool-heading', CoolHeading);
    </script>
  </body>
</html>
```

</details>

## Customizing our element

<aside class="notice">
  We show examples using imperative DOM manipulation to make it easy to understand the basics. Unless you are building super portable components, you will likely use some helper libraries for templating/rendering. We will look into that later in the codelab.
</aside>

In the previous step, you learned how to set up a basic custom element. Now it's time to actually make it do something useful.

When the browser instantiates our custom element it calls some lifecycle callbacks. For now, these are the most important ones we need to know about:

```js
class MyElement extends HTMLElement {
  constructor() {
    super();
    // called when the class is instantiated (standard js)
  }

  connectedCallback() {
    /**
     * called when the element is connected to the page
     * this can be called multiple times during the element's lifecycle
     * for example when using drag&drop to move elements around
     */
  }

  disconnectedCallback() {
    // called when the element is disconnected from the page
  }
}
```

Because our element extends from `HTMLElement`, when it is instantiated the class instance is an actual live DOM element. All the methods and properties we are familiar with from the regular DOM element exist here as well.

For example, let's add some styles to our element:

```js
class CoolHeading extends HTMLElement {
  connectedCallback() {
    this.style.color = 'blue';
  }
}
```

The text in our element should now appear blue.

To respond to user input, we can add an event listener to our element or one of its children. Let's add one to change the color of our element on click:

```js
class CoolHeading extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', () => {
      this.style.color = 'red';
    });
  }

  connectedCallback() {
    this.style.color = 'blue';
  }
}
```

<aside class="notice">
We're adding the event listener in the constructor here because the `connectedCallback` can be called multiple times during the lifecycle of our element, for example when using drag and drop an element is disconnected from one location and connected again in another. That would cause the event listener to be registered multiple times, a common source of bugs.
</aside>

If we run this code in the browser, the element should turn blue on click.

<details>
  <summary>
    View final result
  </summary>

```html
<!DOCTYPE html>

<html>
  <body>
    <cool-heading>
      <h1>Hello world!</h1>
    </cool-heading>

    <script>
      class CoolHeading extends HTMLElement {
        constructor() {
          super();

          this.addEventListener('click', () => {
            this.style.color = 'red';
          });
        }

        connectedCallback() {
          this.style.color = 'blue';
        }
      }

      customElements.define('cool-heading', CoolHeading);
    </script>
  </body>
</html>
```

</details>

## Templating

The second Web Components API we will look into is HTML templates. When writing web components, we usually need to do more than just setting some styles or text. We often need to render larger pieces of HTML as part of our component and update parts of it when the user interacts with the page.

To do this efficiently, browsers have a template element. This allows us to define the structure of a piece of HTML once upfront, and efficiently clone this each time the element is rendered on the page. This is a lot faster than recreating the same HTML structure each time. Writing and cloning templates is (intentionally) pretty low level, you will usually not want to do this manually. You can read more about the basic API [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

For writing templates, we recommend the [lit-html](https://github.com/Polymer/lit-html) library. We will use [lit-element](https://github.com/Polymer/lit-element), which makes it easy to use it in a web component.

LitElement is written and distributed as es modules, this means we can import it using the browser's native module loader. Let's create a module script, and import `LitElement` from a CDN:

```html
<!DOCTYPE html>

<html>
  <body>
    <script type="module">
      import { LitElement } from 'https://unpkg.com/lit-element?module';
    </script>
  </body>
</html>
```

Make sure you add `type="module"` to the script tag!

Next, we need to define our class. Instead of extending `HTMLElement`, we are now extending `LitElement`. `LitElement` extends `HTMLElement` already, so we're still creating an actual custom element:

```js
class WebComponentApis extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    console.log('lit element connected');
  }
}

customElements.define('web-component-apis', WebComponentApis);
```

```html
<web-component-apis></web-component-apis>
```

If you run this in the browser you should see `lit element connected` logged to the terminal.

Now that we have our element based on LitElement, we can start adding our template. lit-html works by writing HTML inside of template literals. These are a type of strings which can span multiple lines, ideal for writing HTML:

```js
const template = `
 <h1>Hello world</h1>
`;
```

In order to create an actual lit-html template, we need to prefix the template literal with a special HTML tag:

```js
import { html } from 'https://unpkg.com/lit-element?module';

const template = html`
  <h1>Hello world</h1>
`;
```

This is a native browser feature called [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates). The `html` tag is just a function that gets called with information about template literal it's attached to. We won't go into details of how it works exactly, but by using this syntax `lit-html` can very efficiently create templates and update only the parts that change when re-rendering.

Most popular IDEs support syntax highlighting of HTML inside template literals, but for some you might need to install a plugin. [See our IDE section](https://open-wc.org/developing/ide.html#visual-studio-code) to learn more about that.

lit-element works with a `render` function, which is called each time the element is updated. From this function, we need to return the template we want to render to the page.

Let's take the list of Web Component APIs we saw in the previous step, and add it as a lit-html template:

```js
import { LitElement, html } from 'https://unpkg.com/lit-element?module';

class WebComponentApis extends LitElement {
  render() {
    return html`
      <h1>Basic Web Components APIs</h1>

      <ul>
        <li>Custom Elements</li>
        <li>Templates</li>
        <li>Shadow DOM</li>
      </ul>
    `;
  }
}

customElements.define('web-component-apis', WebComponentApis);
```

```html
<web-component-apis></web-component-apis>
```

After you've added your component to the page, you see the template we added rendered on the screen.

<aside class="notice">
LitElement offers a lot more features than just rendering templates, check out our <a href="https://open-wc.org/codelabs/">other codelabs</a> for that.
</aside>

<details>
  <summary>
    View final result
  </summary>

```html
<!DOCTYPE html>

<html>
  <body>
    <web-component-apis></web-component-apis>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class WebComponentApis extends LitElement {
        render() {
          return html`
            <h1>Basic Web Components APIs</h1>

            <ul>
              <li>Custom Elements</li>
              <li>Templates</li>
              <li>Shadow DOM</li>
            </ul>
          `;
        }
      }

      customElements.define('web-component-apis', WebComponentApis);
    </script>
  </body>
</html>
```

</details>

## Shadow DOM

The last important web component API we will look into is shadow DOM. Traditionally, HTML and CSS have always been global. This scales pretty badly, we need to make sure that ids are unique on the page and CSS selector can get pretty complex. This is why many front-end frameworks offer some form of encapsulation. With shadow DOM, this capability is now built into the browser.

The best way to visualize this is to inspect the element we created in the previous step. In the DOM inspector you will see that the children rendered by our element are not direct children of our element, but are wrapped inside of a shadow root:

![Shadow DOM example](./assets/shadow-dom-1.png)

This shadow root is a special type of dom node, which encapsulates the elements inside it. Styles defined inside this shadow root do not leak out, and styles defined outside the shadow root do not reach in. Also, it's not possible to use `querySelector` to select elements inside or outside the shadow root. This way we can build reusable components and be confident that they will always work the same way in any environment.

Let's visualize this by adding some styles to our component. In `LitElement`, we can add styles to our component using a static `styles` field:

```js
import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

class WebComponentApis extends LitElement {
  static get styles() {
    return css`
      h1 {
        color: red;
      }

      ul {
        color: blue;
        list-style-type: upper-roman;
      }
    `;
  }

  render() {
    return html`
      <h1>Basic Web Components APIs</h1>

      <ul>
        <li>Custom Elements</li>
        <li>Templates</li>
        <li>Shadow DOM</li>
      </ul>
    `;
  }
}

customElements.define('web-component-apis', WebComponentApis);
```

When we refresh the page, our element should now be styled.

To see the encapsulation in action, we can add the same content of our template to the page outside our component:

```html
<!DOCTYPE html>

<html>
  <body>
    <h1>Basic Web Components APIs</h1>

    <ul>
      <li>Custom Elements</li>
      <li>Templates</li>
      <li>Shadow DOM</li>
    </ul>

    <web-component-apis></web-component-apis>

    <script type="module">
      ...
    </script>
  </body>
</html>
```

If we refresh the page again, we should see that the styles inside our component do not affect the HTML outside of it.

![Shadow DOM example](./assets/shadow-dom-2.png)

Similarly we can add styles to the main page, and you will see that it doesn't affect the HTML inside our component:

```html
<!DOCTYPE html>

<html>
  <body>
    <style>
      h1 {
        color: pink;
      }

      ul {
        font-weight: bold;
        list-style-type: decimal;
      }
    </style>

    <h1>Basic Web Components APIs</h1>

    <ul>
      <li>Custom Elements</li>
      <li>Templates</li>
      <li>Shadow DOM</li>
    </ul>

    <web-component-apis></web-component-apis>

    <script type="module">
      ...
    </script>
  </body>
</html>
```

Not all CSS properties are encapsulated in this way. Inherited properties such as fonts and color do inherit through the shadow root when they are applied to a parent element.

For example we can change the front of our page and it will affect the text inside our component as well:

```html
<style>
  body {
    font-family: monospace;
  }

  h1 {
    color: pink;
  }

  ul {
    font-weight: bold;
    list-style-type: decimal;
  }
</style>
```

<details>
  <summary>
    View final result
  </summary>

```html
<!DOCTYPE html>

<html>
  <body>
    <style>
      body {
        font-family: monospace;
      }

      h1 {
        color: pink;
      }

      ul {
        font-weight: bold;
        list-style-type: decimal;
      }
    </style>

    <h1>Basic Web Components APIs</h1>

    <ul>
      <li>Custom Elements</li>
      <li>Templates</li>
      <li>Shadow DOM</li>
    </ul>

    <web-component-apis></web-component-apis>

    <script type="module">
      import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

      class WebComponentApis extends LitElement {
        static get styles() {
          return css`
            h1 {
              color: red;
            }

            ul {
              color: blue;
              list-style-type: upper-roman;
            }
          `;
        }

        render() {
          return html`
            <h1>Basic Web Components APIs</h1>

            <ul>
              <li>Custom Elements</li>
              <li>Templates</li>
              <li>Shadow DOM</li>
            </ul>
          `;
        }
      }

      customElements.define('web-component-apis', WebComponentApis);
    </script>
  </body>
</html>
```

</details>

## Web Components in the wild

Web Components are being used in the wild by many projects and companies. Some examples:

### Github

Github uses web component for various part of their website. They're using just the Custom Elements API, relying on global styling. They use them as a progressive enhancements, on browsers without support or when javascript is turned off, there is a fallback text that is displayed.

Their elements are open source, [you can find them here](https://github.com/github/time-elements).

![Example github web component](./assets/github-example-1.png)

![Example github web component](./assets/github-example-2.png)

### Twitter

Twitter utilizes Web Components for embedding tweets. They're using both Custom Elements and shadow DOM, because they need to ensure the styling of the tweet is consistent across pages and the styling of the component doesn't interfere with the styling of the page.

On browsers which don't support Web Components, twitter uses an iframe to achieve a similar functionality (with a much higher cost).

![Example twitter web component](./assets/twitter-example-1.png)

![Example twitter web component code](./assets/twitter-example-2.png)

### Video

The `<video>` element is built into the browser, and it's actually also using shadow DOM. When you place a video element on the page it actually renders a lot more UI for the controls.

You can inspect the shadow DOM of these elements on most browser after enabling a setting in your DevTools.

![Example video element shadow dom](./assets/video-example-1.png)

![Example video element shadow dom](./assets/video-example-2.png)
