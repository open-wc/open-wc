# lit-html & lit-element: intermediate

## Introduction

This codelab is a followup from the [lit-html & lit-element basics](https://open-wc.org/codelabs/#web-components-basics) codelab.

[lit-html](https://github.com/Polymer/lit-html) is an efficient, expressive and extensible HTML templating library for JavaScript. It lets you write HTML templates in JavaScript, then efficiently render and re-render those templates together with data to create and update DOM:

[lit-element](https://github.com/Polymer/lit-element) is a simple base class for creating fast and lightweight web components with lit-html.

**What you need**

- A web browser that supports Web Components: Firefox, Safari, Chrome or any Chromium-based browser.
- Intermediate knowledge of HTML and Javascript
- Basic knowledge of web components, see our [basics codelab](https://open-wc.org/codelabs/#web-components-basics) to get you started.
- Basic knowledge of lit-html & lit-element, see our [basics codelab](https://open-wc.org/codelabs/#lit-html-lit-element-basics)
- Familiarity with the following concepts:
  - [Javascript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
  - [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
  - [Array filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
  - [Array map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
  - [Object & array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
  - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  - [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

**What you'll learn**

- Connecting you web component to an API
- Handling asynchronous rendering
- Complex templating
- Using third-party components
- Creating lit-html template functions

**How it works**

Unlike the [basics codelab](https://open-wc.org/codelabs/#lit-html-lit-element-basics), we will not explain the required changes for each step in detail. Instead, we give background information and the desired end-result. In most steps, we offer some tips, most of them hidden behind a toggle.

At the bottom of each section, there is a "View final result" button, this will show you the correct code that you should end up with, in case you get stuck. The steps are sequential, thus results from the previous steps carry over to the next step.

## Setup

In this codelab, we will build a hackernews app. This is a great exercise to learn the intermediate parts of lit-html and lit-element.

You can follow this codelab using anything that can display a simple HTML page. For the best editing experience, we recommend setting this up using your favorite IDE. Alternatively, you can use an online code editor like [jsbin](https://jsbin.com/?html,output), [stackblitz](https://stackblitz.com/) or [webcomponents.dev](https://webcomponents.dev/).

Let's create a basic HTML page with a module script, and import LitElement from a CDN:

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

Make sure that you add `type="module"` to the script tag.

<aside class="notice">
In this example, we are using `unpkg`, a CDN from which we can easily import any modules that are available on NPM. When working on a real project, it is a good idea to use an actual package manager such as NPM or yarn.
</aside>

You should already know how to create a web component using `LitElement`. Go ahead and create one which renders '_My hackernews app_' to the screen. When it works, you're ready to move on to the next step.

---

<details>
 <summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <hackernews-app></hackernews-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class HackerNewsApp extends LitElement {
        render() {
          return html`
            My hackernews app
          `;
        }
      }

      customElements.define('hackernews-app', HackerNewsApp);
    </script>
  </body>
</html>
```

</details>

## HackerNews API

For this codelab, we will be fetching live data from the HackerNews API. To retrieve an item from the api you need its id.

```js
  const itemId = 22115410;
  const path = `https://hacker-news.firebaseio.com/v0/item/${itemId}.json`;
```

Create your URL with the itemId above, and visit it from the browser. You should see the API return a JSON response, which looks similar to this:

```json
{
  "by": "[username]",
  "id": 22115410,
  "kids": ["..."],
  "parent": 22106482,
  "text": "lorem ipsum",
  "time": 1579678389,
  "type": "comment"
}
```

<aside class="notice">
  Get the full <a href="https://github.com/HackerNews/API">HackerNews API Documentation</a>. There is additional detailed information about the endpoints and a list of all available endpoints. These endpoints are not required for this tutorial.
</aside>

## Fetching HackerNews comments

Besides displaying UI, web components can also use any of the available javascript APIs. We are going to use the `fetch` function to make an HTTP request to retrieve our HackerNews comments. `fetch` is an asynchronous operation, and it costs system resources. We, therefore, need to be a bit more careful about when and how we use it.

`LitElement` has several lifecycle methods available for this, some of them will be familiar to you by now. See [this page](/faq/lit-element-lifecycle.html) for a full overview and reference of all the available lifecycle methods.

We could trigger our `fetch` in the constructor since it's run only once. But because it's a best practice to not perform any side effects there, it's better to use the `connectedCallback.` Because this method can be called multiple times during an element's lifecycle, we should be careful to trigger a `fetch` only when the data hasn't already been fetched before.

### Tasks to complete this step:

- Fetch five comments from the news API
- Render the fetched comments as JSON

<aside class="notice">
  You can use the item id <i style="font-weight: 700;">22115410</i> as a starting point.
</aside>

### Tips

The HN API doesn't distinguish its items, thus it might be difficult to know if a received object is indeed a comment. To verify that the data fetched from the HackerNews API is a comment you can simply use an if-conditional and check against its data.type.

```js
if(data.type !== "comment") return false;
return true;
```

<details>
 <summary>Using fetch</summary>
<code>fetch</code> is a browser API for making HTTP requests. It's promise based, and it returns a streaming response. We can turn the the stream into JSON using the <code>json</code> function:

```js
async fetchComments() {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/item/221154410.json');
  const jsonResponse = await response.json();
  this.comments = jsonResponse.data;
}
```

If you're not familiar with [async await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), this is what it looks like using `Promise`:

```js
fetchComments() {
  fetch('https://hacker-news.firebaseio.com/v0/item/221154410.json')
    .then(response => response.json())
    .then((jsonResponse) => {
      this.comments = jsonResponse.comments;
    });
}
```

</details>

<details>
 <summary>Example connectedCallback</summary>

```js
class HackerNewsApp extends LitElement {
  connectedCallback() {
    super.connectedCallback();

    if (!this.comments) {
      this.fetchComments();
    }
  }
}
```

</details>

<details>
<summary>Example of comments rendered as JSON</summary>

```js
render() {
  return html`
    <pre>${JSON.stringify(this.comments, null, 2)}</pre>
  `;
}
```

</details>

<details>
<summary>Example of how to fetch multiple comments from the HackerNews API</summary>

```js
async fetchComments() {
  // configurations for the HackerNews API
  const path = "https://hacker-news.firebaseio.com/v0/item";
  const itemId = 22115410; // random itemId from HackerNews

  let idx = 0;
  const maxItems = 5;   // the maximum amount of items the comments array should contain
  const array = [];

  // loop and query a new item from the HackerNews API by decreasing the itemId with
  // the index idx until the array has the same length as maxItems
  while (array.length < maxItems) {
    const res = await fetch(`${path}/${itemId - idx}.json`)
    const data = await res.json().data

    if(data.type !== "comment") return;
    array.push(data);
    idx++;
  }

  this.comments = array;
}
```

</details>

---

<details>
 <summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <hackernews-app></hackernews-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class HackerNewsApp extends LitElement {
        static get properties() {
          return {
            comments: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.comments) {
            this.fetchComments();
          }
        }

        async fetchComments() {
          const path = "https://hacker-news.firebaseio.com/v0/item";
          const itemId = 22115410;

          let idx = 0;
          const maxItems = 5;
          const array = [];

          while (array.length < maxItems) {
            const res = await fetch(`${path}/${itemId - idx}.json`)
            const data = await res.json().data

            if(data.type !== "comment") return;
            array.push(data);
            idx++;
          }

          this.comments = array;
        }

        render() {
          return html`
            <pre>${JSON.stringify(this.comments, null, 2)}</pre>
          `;
        }
      }

      customElements.define('hackernews-app', HackerNewsApp);
    </script>
  </body>
</html>
```

</details>

## Displaying a loading state

Fetching HackerNews comments is async, so the first time your `render` function is called they aren't there yet. This isn't a problem right now, because `JSON.stringify` handles null or undefined input. But when we want to start doing things with the comments, our code will crash because the first time `this.comments` is undefined.

We can cover this scenario by preventing the rendering of our main content until the comments are fetched. We can take this opportunity to display a nice loading state for the user as well.

### Tasks to complete this step

- Maintain a boolean indicating whether comments are being fetched
- Display a message while comments are being fetched

<details>
<summary>Maintain a loading state while fetching</summary>

```js
async fetchComments() {
  this.loading = true;
  const path = "https://hacker-news.firebaseio.com/v0/item";
  const itemId = 22115410;

  let idx = 0;
  const maxItems = 5;
  const array = [];

  while (array.length < maxItems) {
    const res = await fetch(`${path}/${itemId - idx}.json`)
    const data = await res.json().data

    if(data.type !== "comment") return;
    array.push(data);
    idx++;
  }

  this.comments = array;
  this.loading = false;
}
```

</details>

<details>
<summary>Prevent rendering the main content while loading</summary>

```js
render() {
  if (this.loading) {
    return html`<p>Loading...</p>`;
  }

  return html`
    <pre>${JSON.stringify(this.comments, null, 2)}</pre>
  `;
}
```

</details>

---

<details>
 <summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <hackernews-app></hackernews-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class HackerNewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            comments: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.comments) {
            this.fetchComments();
          }
        }

        async fetchComments() {
          this.loading = true;
          const path = "https://hacker-news.firebaseio.com/v0/item";
          const itemId = 22115410;

          let idx = 0;
          const maxItems = 5;
          const array = [];

          while (array.length < maxItems) {
            const res = await fetch(`${path}/${itemId - idx}.json`)
            const data = await res.json().data

            if(data.type !== "comment") return;
            array.push(data);
            idx++;
          }

          this.comments = array;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          return html`
            <pre>${JSON.stringify(this.comments, null, 2)}</pre>
          `;
        }
      }

      customElements.define('hackernews-app', HackerNewsApp);
    </script>
  </body>
</html>
```

</details>

## Displaying comments

To display individual comment it's best to create a new component so that we separate the logic from the main app. This should be a plain UI component, which receives the comment data as plain properties to display.

### Tasks to complete this step

- Create a `hn-comment` element that displays the comment's title and description.
- Display a list of `hn-comment` elements in the `hackernews-app`, one for each comment received from the news API.

### Tips

<details>
 <summary>Create an comment component</summary>

```js
class HackerNewsComment extends LitElement {
  static get properties() {
    return {
      type: { type: String },
      text: { type: String },
    };
  }

  render() {
    return html`
      <h3>${this.type}</h3>
      <p>${this.text}</p>
    `;
  }
}

customElements.define('hn-comment', HackerNewsComment);
```

</details>

<details>
<summary>Display a list of comments</summary>

```js
render() {
  return html`
    <ul>
      ${this.comments.map(
        comment => html`
          <li>
            <hn-comment
              .type=${comment.type}
              .text=${comment.text}
            ></hn-comment>
          </li>
        `,
      )}
    </ul>
  `;
}
```

</details>

---

<details>
<summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <hackernews-app></hackernews-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class HackerNewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            comments: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.comments) {
            this.fetchComments();
          }
        }

        async fetchComments() {
          this.loading = true;
          const path = "https://hacker-news.firebaseio.com/v0/item";
          const itemId = 22115410;

          let idx = 0;
          const maxItems = 5;
          const array = [];

          while (array.length < maxItems) {
            const res = await fetch(`${path}/${itemId - idx}.json`)
            const data = await res.json().data

            if(data.type !== "comment") return;
            array.push(data);
            idx++;
          }

          this.comments = array;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          return html`
            <h1>HackerNews Comment App</h1>

            <h2>Comments</h2>
            <ul>
              ${this.comments.map(
                comment => html`
                  <li>
                    <hn-comment
                      .type=${comment.type}
                      .text=${comment.text}
                    ></hn-comment>
                  </li>
                `,
              )}
            </ul>
          `;
        }
      }

      customElements.define('hackernews-app', HackerNewsApp);

      class HackerNewsComment extends LitElement {
        static get properties() {
          return {
            type: { type: String },
            text: { type: String },
          };
        }

        render() {
          return html`
            <h3>${this.type}</h3>
            <p>${this.text}</p>
          `;
        }
      }

      customElements.define('hn-comment', HackerNewsComment);
    </script>
  </body>
</html>
```

</details>

## Adding a read/unread toggle

Any serious comment overview app allows the user to track whether or not they have read a comment, so let's add this capability to ours as well.

As a start, you can maintain a local property for the read/unread status in the `hn-comment` component. We will look into lifting this data to the parent component in the next step.

### Tasks to complete this step

- Add a property on the `hn-comment` component which indicates whether the user has read the comment.
- Display the read/unread status in the title of each comment.
- Add a button on the `hn-comment` component to toggle between the read/unread status, storing this status locally.

### Tips

<details>
<summary>Conditional templating</summary>

You can conditionally render something using any valid javascript expression. For simple logic, a ternary operator is sufficient:

```js
render() {
  return html`
    <h3>${this.type} (${this.read ? 'read' : 'unread'})</h3>
  `;
}
```

If the logic is a bit more complex, separating this into a pure function is very useful. The advantage here is that we can use regular if statements, so we don't need to squash everything into a single expression:

```js
function readStatus(read) {
  if (read) {
    return '(read)';
  }

  return '(unread)';
}

class MyElement extends LitElement {
  render() {
    return html`
      My comment (${readStatus(this.read)})
    `;
  }
}
```

</details>

<details>
 <summary>Adding event listeners</summary>
With lit-html, you can add event listeners using the <code>@</code> syntax, which is just syntax sugar for `addEventListener`:

```js
render() {
 return html`
   <button @click=${this._onClick}></button>
 `;
}

_onClick(e) {

}
```

In this example, we register an event listener for the `click` event, and call the `_onClick` method on the element when this event is fired.

</details>

---

<details>
<summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <hackernews-app></hackernews-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class HackerNewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            comments: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.comments) {
            this.fetchComments();
          }
        }

        async fetchComments() {
          this.loading = true;
          const path = "https://hacker-news.firebaseio.com/v0/item";
          const itemId = 22115410;

          let idx = 0;
          const maxItems = 5;
          const array = [];

          while (array.length < maxItems) {
            const res = await fetch(`${path}/${itemId - idx}.json`)
            const data = await res.json().data

            if(data.type !== "comment") return;
            array.push(data);
            idx++;
          }

          this.comments = array;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          return html`
            <h1>HackerNews Comment App</h1>

            <h2>Comments</h2>
            <ul>
              ${this.comments.map(
                comment => html`
                  <li>
                    <hn-comment
                      .type=${comment.type}
                      .text=${comment.text}
                      .read=${comment.read}
                    ></hn-comment>
                  </li>
                `,
              )}
            </ul>
          `;
        }
      }

      customElements.define('hackernews-app', HackerNewsApp);

      class HackerNewsComment extends LitElement {
        static get properties() {
          return {
            type: { type: String },
            text: { type: String },
            read: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.type} (${this.read ? 'read' : 'unread'})</h3>
            <p>${this.text}</p>
            <button @click=${this._toggleReadStatus}>
              Mark as ${this.read ? 'unread' : 'read'}
            </button>
          `;
        }

        _toggleReadStatus() {
          this.read = !this.read;
        }
      }

      customElements.define('hn-comment', HackerNewsComment);
    </script>
  </body>
</html>
```

</details>

## Add a read/unread counter

Now that the user can mark comments as read/unread, we want to display the total amount of read and unread items in the app. This counter should be displayed in the `hackernews-app`, but we're storing the read/unread status in the `hn-comment` component. We need to think of a better way to solve this...

It's best to keep the data in your application flowing in one direction from top to bottom. Parent components are responsible for data of child components, including changing this data.

In our case, the `hn-comment` component can fire an event to the `hackernews-app` component to request a change in the read/unread status.

### Tasks to complete this step

- Communicate the read/unread status of the comment back to the `hackernews-app` component.
- Display the total amount of read and unread comments in the `hackernews-app` component.

### Tips

Remember that with `LitElement`, you need to use immutable data patterns. Otherwise, it will not be able to pick up data changes.

<details>
 <summary>Firing events</summary>

```js
_toggleReadStatus() {
  this.dispatchEvent(new CustomEvent('toggle-read-status'));
}
```

</details>

<details>
 <summary>Catch event from a list of elements</summary>

When you add an event listener on an element in a list of templates, you need a way to know which element in the list fired the event. This can be done by passing the list item to the event handler:

```js
html`
  ${this.comments.map(
    comment => html`
      <li>
        <hn-comment @toggle-read-status=${() => this._toggleReadStatus(comment)}></hn-comment>
      </li>
    `,
  )}
`;
```

</details>

<details>
 <summary>Update read status in main app</summary>

To update the read status, we need to use immutable data update patterns. This means we should create a comments array, and a new object for the comment that was updated. A quick way to do this, is by using a map function:

```js
_toggleReadStatus(commentToUpdate) {
  this.comments = this.comments.map(comment => {
    return comment === commentToUpdate ? { ...comment, read: !comment.read } : comment;
  });
}
```

</details>

<details>
 <summary>Calculating derived data</summary>

To display the total amount of read/unread items, we can calculate it on top of the render function:

```js
render() {
 const totalRead = this.comments.filter(a => a.read).length;

 return html`...`;
}
```

</details>

---

<details>
<summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <hackernews-app></hackernews-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class HackerNewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            comments: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.comments) {
            this.fetchComments();
          }
        }

        async fetchComments() {
          this.loading = true;
          const path = "https://hacker-news.firebaseio.com/v0/item";
          const itemId = 22115410;

          let idx = 0;
          const maxItems = 5;
          const array = [];

          while (array.length < maxItems) {
            const res = await fetch(`${path}/${itemId - idx}.json`)
            const data = await res.json().data

            if(data.type !== "comment") return;
            array.push(data);
            idx++;
          }

          this.comments = array;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          const totalRead = this.comments.filter(a => a.read).length;
          const totalUnread = this.comments.length - totalRead;

          return html`
            <h1>HackerNews Comment App</h1>

            <h2>Comments</h2>
            <p>(${totalRead} read and ${totalUnread} unread)</p>
            <ul>
              ${this.comments.map(
                comment => html`
                  <li>
                    <hn-comment
                      .type=${comment.type}
                      .text=${comment.text}
                      .read=${comment.read}
                      @toggle-read-status=${() => this._toggleReadStatus(comment)}
                    ></hn-comment>
                  </li>
                `,
              )}
            </ul>
          `;
        }

        _toggleReadStatus(commentToUpdate) {
          this.comments = this.comments.map(comment => {
            return comment === commentToUpdate ? { ...comment, read: !comment.read } : comment;
          });
        }
      }

      customElements.define('hackernews-app', HackerNewsApp);

      class HackerNewsComment extends LitElement {
        static get properties() {
          return {
            type: { type: String },
            text: { type: String },
            read: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.type} (${this.read ? 'read' : 'unread'})</h3>
            <p>${this.text}</p>
            <button @click=${this._toggleReadStatus}>
              Mark as ${this.read ? 'unread' : 'read'}
            </button>
          `;
        }

        _toggleReadStatus() {
          this.dispatchEvent(new CustomEvent('toggle-read-status'));
        }
      }

      customElements.define('hn-comment', HackerNewsComment);
    </script>
  </body>
</html>
```

</details>

## Add a read/unread filter

Now that the `hackernews-app` component knows about the read/unread status, we can do more interesting things like allowing the user to filter based on the comment's status.

It's a good practice to separate concerns in your application, and in a real application, such a filter might grow to be quite complex in UI and logic. In those cases, it can be a good idea to separate it into a separate component.

If the functionality is small, like in our example application, we can keep it in the `hackernews-app` component for now.

### Tasks to complete this step

- Add three buttons to the `hackernews-app` component:
  - A button which displays only read comments
  - A button which displays only unread comments
  - A button which displays all comments

### Tips

<details>
 <summary>Creating a filter</summary>

To create a filter, each of the three buttons can update a `filter` property on the element. Changing this property should trigger a re-render.

Then, on the top of your `render` function, you can filter the array of comments using this filter value. Make sure you're using this new array in your template, and not the original array.

</details>

---

<details>
<summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <hackernews-app></hackernews-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class HackerNewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            comments: { type: Array },
            filter: { type: String },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.comments) {
            this.fetchComments();
          }
        }

        async fetchComments() {
          this.loading = true;
          const path = "https://hacker-news.firebaseio.com/v0/item";
          const itemId = 22115410;

          let idx = 0;
          const maxItems = 5;
          const array = [];

          while (array.length < maxItems) {
            const res = await fetch(`${path}/${itemId - idx}.json`)
            const data = await res.json().data

            if(data.type !== "comment") return;
            array.push(data);
            idx++;
          }

          this.comments = array;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          const totalRead = this.comments.filter(a => a.read).length;
          const totalUnread = this.comments.length - totalRead;
          const comments = this.comments.filter(comment => {
            if (!this.filter) {
              return true;
            }
            return this.filter === 'read' ? comment.read : !comment.read;
          });

          return html`
            <h1>HackerNews Comments App</h1>

            <h2>Comments</h2>
            <p>(${totalRead} read and ${totalUnread} unread)</p>

            <button @click=${this._filterNone}>Filter none</button>
            <button @click=${this._filterRead}>Filter read</button>
            <button @click=${this._filterUnread}>Filter unread</button>

            <ul>
              ${comments.map(
                comment => html`
                  <li>
                    <hn-comment
                      .type=${comment.type}
                      .text=${comment.text}
                      .read=${comment.read}
                      @toggle-read-status=${() => this.toggleReadStatus(comment)}
                    ></hn-comment>
                  </li>
                `,
              )}
            </ul>
          `;
        }

        toggleReadStatus(commentToUpdate) {
          this.comments = this.comments.map(comment => {
            return comment === commentToUpdate ? { ...comment, read: !comment.read } : comment;
          });
        }

        _filterNone() {
          this.filter = null;
        }

        _filterRead() {
          this.filter = 'read';
        }

        _filterUnread() {
          this.filter = 'unread';
        }
      }

      customElements.define('hackernews-app', HackerNewsApp);

      class HackerNewsComment extends LitElement {
        static get properties() {
          return {
            type: { type: String },
            text: { type: String },
            read: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.type} (${this.read ? 'read' : 'unread'})</h3>
            <p>${this.text}</p>
            <button @click=${this._toggleReadStatus}>
              Mark as ${this.read ? 'unread' : 'read'}
            </button>
          `;
        }

        _toggleReadStatus() {
          this.dispatchEvent(new CustomEvent('toggle-read-status'));
        }
      }

      customElements.define('hn-comment', HackerNewsComment);
    </script>
  </body>
</html>
```

</details>

## Using other components

The great thing about web components is that we can pick up components built with any technology, and use them without knowing the internal implementation.

The [Material Web Components](https://github.com/material-components/material-components-web-components) is a project to implement material design in web components. It is currently in alpha, but we can already use many of the components.

### Tasks to complete this step

- Replace all the `<button>` elements in the application with `<mwc-button>`

### Tips

To import a web component, you can use a 'side effects' import. This just runs the code of the module, which registers the web component.

```js
import 'https://unpkg.com/@material/mwc-button?module';
```

<details>
 <summary>Using the mwc-button component</summary>

`<mwc-button>` works the same a `<button>` element, we can just replace it's usage:

From:

```js
html`
  <button @click=${this._filterNone}>Filter none</button>
  <button @click=${this._filterRead}>Filter read</button>
  <button @click=${this._filterUnread}>Filter unread</button>
`;
```

To:

```js
html`
  <mwc-button @click=${this._filterNone}>Filter none</mwc-button>
  <mwc-button @click=${this._filterRead}>Filter read</mwc-button>
  <mwc-button @click=${this._filterUnread}>Filter unread</mwc-button>
`;
```

</details>

---

<details>
<summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <hackernews-app></hackernews-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';
      import 'https://unpkg.com/@material/mwc-button?module';

      class HackerNewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            comments: { type: Array },
            filter: { type: String },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.comments) {
            this.fetchComments();
          }
        }

        async fetchComments() {
          this.loading = true;
          const path = "https://hacker-news.firebaseio.com/v0/item";
          const itemId = 22115410;

          let idx = 0;
          const maxItems = 5;
          const array = [];

          while (array.length < maxItems) {
            const res = await fetch(`${path}/${itemId - idx}.json`)
            const data = await res.json().data

            if(data.type !== "comment") return;
            array.push(data);
            idx++;
          }

          this.comments = array;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          const totalRead = this.comments.filter(a => a.read).length;
          const totalUnread = this.comments.length - totalRead;
          const comments = this.comments.filter(comment => {
            if (!this.filter) {
              return true;
            }
            return this.filter === 'read' ? comment.read : !comment.read;
          });

          return html`
            <h1>HackerNews Comment App</h1>

            <h2>Comments</h2>
            <p>(${totalRead} read and ${totalUnread} unread)</p>

            <mwc-button @click=${this._filterNone}>Filter none</mwc-button>
            <mwc-button @click=${this._filterRead}>Filter read</mwc-button>
            <mwc-button @click=${this._filterUnread}>Filter unread</mwc-button>

            <ul>
              ${comments.map(
                comment => html`
                  <li>
                    <hn-comment
                      .type=${comment.type}
                      .text=${comment.text}
                      .read=${comment.read}
                      @toggle-read-status=${() => this.toggleReadStatus(comment)}
                    ></hackernews-app>
                  </li>
                `,
              )}
            </ul>
          `;
        }

        toggleReadStatus(commentToUpdate) {
          this.comments = this.comments.map(comment => {
            return comment === commentToUpdate ? { ...comment, read: !comment.read } : comment;
          });
        }

        _filterNone() {
          this.filter = null;
        }

        _filterRead() {
          this.filter = 'read';
        }

        _filterUnread() {
          this.filter = 'unread';
        }
      }

      customElements.define('hackernews-app', HackerNewsApp);

      class HackerNewsComment extends LitElement {
        static get properties() {
          return {
            type: { type: String },
            text: { type: String },
            read: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.type} (${this.read ? 'read' : 'unread'})</h3>
            <p>${this.text}</p>
            <mwc-button @click=${this._toggleReadStatus}>
              Mark as ${this.read ? 'unread' : 'read'}
            </mwc-button>
          `;
        }

        _toggleReadStatus() {
          this.dispatchEvent(new CustomEvent('toggle-read-status'));
        }
      }

      customElements.define('hn-comment', HackerNewsComment);
    </script>
  </body>
</html>
```

</details>

## Template function

For our `hn-comment` we created a separate web component. A web component creates a strong encapsulation boundary between the parent and child components. This is a great feature, we can develop components in complete isolation.

But sometimes this can be overkill for just simple templates, or we may want to have no boundaries so that we can share styles or select DOM nodes.

Since lit-html templates are actual javascript variables, we could write our template as a function which returns our template:

```js
function messageTemplate(message) {
  return html`
    <h1>${message}</h1>
  `;
}
```

### Tasks to complete this step

- Replace the `hn-comment` component with a template function.

### Tips

<details>
 <summary>Handling events in template functions</summary>

We cannot fire any events from the template function. Instead, we should pass along the event handler from the parent component.

```js
function commentTemplate(comment, toggleReadStatus) {
  return html`
    <h3>${comment.title} (${comment.read ? 'read' : 'unread'})</h3>
    <p>${comment.text}</p>
    <mwc-button @click=${toggleReadStatus}>
      Mark as ${comment.read ? 'unread' : 'read'}
    </mwc-button>
  `;
}
```

Then, to render the template:

```js
html`
  <li>
    ${commentTemplate(comment, () => this.toggleReadStatus(comment))}
  </li>
`;
```

</details>

---

<details>
<summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <hackernews-app></hackernews-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';
      import 'https://unpkg.com/@material/mwc-button?module';

      function commentTemplate(comment, toggleReadStatus) {
        return html`
          <h3>${comment.type} (${comment.read ? 'read' : 'unread'})</h3>
          <p>${comment.text}</p>
          <mwc-button @click=${toggleReadStatus}>
            Mark as ${comment.read ? 'unread' : 'read'}
          </mwc-button>
        `;
      }

      class HackerNewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            comments: { type: Array },
            filter: { type: String },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.comments) {
            this.fetchComments();
          }
        }

        async fetchComments() {
          this.loading = true;
          const path = "https://hacker-news.firebaseio.com/v0/item";
          const itemId = 22115410;

          let idx = 0;
          const maxItems = 5;
          const array = [];

          while (array.length < maxItems) {
            const res = await fetch(`${path}/${itemId - idx}.json`)
            const data = await res.json().data

            if(data.type !== "comment") return;
            array.push(data);
            idx++;
          }

          this.comments = array;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          const totalRead = this.comments.filter(a => a.read).length;
          const totalUnread = this.comments.length - totalRead;
          const comments = this.comments.filter(comment => {
            if (!this.filter) {
              return true;
            }
            return this.filter === 'read' ? comment.read : !comment.read;
          });

          return html`
            <h1>HackerNews Comment App</h1>

            <h2>Comments</h2>
            <p>(${totalRead} read and ${totalUnread} unread)</p>

            <mwc-button @click=${this._filterNone}>Filter none</mwc-button>
            <mwc-button @click=${this._filterRead}>Filter read</mwc-button>
            <mwc-button @click=${this._filterUnread}>Filter unread</mwc-button>

            <ul>
              ${comments.map(
                comment => html`
                  <li>
                    ${commentTemplate(comment, () => this.toggleReadStatus(comment))}
                  </li>
                `,
              )}
            </ul>
          `;
        }

        toggleReadStatus(commentToUpdate) {
          this.comments = this.comments.map(comment => {
            return comment === commentToUpdate ? { ...comment, read: !comment.read } : comment;
          });
        }

        _filterNone() {
          this.filter = null;
        }

        _filterRead() {
          this.filter = 'read';
        }

        _filterUnread() {
          this.filter = 'unread';
        }
      }

      customElements.define('hackernews-app', HackerNewsApp);
    </script>
  </body>
</html>
```

</details>

## Wrapping up

That's the end of the intermediate lit-html & lit-element codelab! If you're eager to learn more, you can take a look at the following resources:

- [lit-html official docs](https://lit-html.polymer-project.org/)
- [lit-element official docs](https://lit-element.polymer-project.org/)
- [open-wc code samples](https://open-wc.org/developing/code-examples.html)
- [IDE help](https://open-wc.org/developing/ide.html)

To get started with your own project we recommend using open-wc's project scaffolding, it's easy to set it up using this command:

```bash
npm init @open-wc
```
