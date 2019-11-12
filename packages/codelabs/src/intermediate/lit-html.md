# lit-html & lit-element: intermediate

## TODO

- make sure all code works
- What you'll learn section

## Introduction

This codelab is a followup from the [lit-html & lit-element basics](https://open-wc.org/codelabs/#web-components-basics) codelab.

[lit-html](https://github.com/Polymer/lit-html) is an efficient, expressive and extensible HTML templating library for JavaScript. It lets you write HTML templates in JavaScript, then efficiently render and re-render those templates together with data to create and update DOM:

[lit-element](https://github.com/Polymer/lit-element) is a simple base class for creating fast and lightweight web components with lit-html.

**What you need**

- Intermediate knowledge of HTML and Javascript
- Basic knowledge of web components, see our [basics codelab](https://open-wc.org/codelabs/#web-components-basics) to get you started.
- Basic knowledge of lit-html & lit-element, see our [basics codelab](https://open-wc.org/codelabs/#lit-html-lit-element-basics)
- A web browser that supports Web Components: Firefox, Safari, Chrome or any Chromium-based browser.

**What you'll learn**

- TODO

**How it works**

Unlike the [basics codelab](https://open-wc.org/codelabs/#lit-html-lit-element-basics), we will not explain the required changes for each step in detail. Instead, we give background information and the desired end-result. In most steps, we offer some tips, most of them hidden behind a toggle.

At the bottom of each section, there is a "View final result" button, this will show you the correct code that you should end up with, in case you get stuck. The steps are sequential, thus results from the previous steps carry over to the next step.

## Setup

In this codelab, we will build a news app. This is a great exercise to learn the intermediate parts of lit-html and lit-element.

You can follow this codelab using anything that can display a simple HTML page. For the best editing experience, we recommend setting this up using your favorite IDE. Alternatively, you can use an [online code editor like jsbin](https://jsbin.com/?html,output).

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

You should already know how to create a web component using `LitElement`. Go ahead and create one which renders '_My news app_' to the screen. When it works, you're ready to move on to the next step.

---

<details>
 <summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <todo-app></todo-app>

    <script type="module">
      import { LitElement } from 'https://unpkg.com/lit-element?module';

      class NewsApp extends LitElement {
        render() {
          return html`
            My news app
          `;
        }
      }

      customElements.define('news-app', NewsApp);
    </script>
  </body>
</html>
```

</details>

## Google news API

For this codelab, we will be fetching live data from the google news API. You will need to retrieve an API key first:

- Go to https://newsapi.org/
- Click 'Get API key'
- Register for an account.
- **tip**: you don't need to use an actual valid e-mail address
- Remember your API key

When you have your API key, you can construct the URL needed to fetch news articles using the following format:
`https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}`.

You will need to fill in your API key and a news topic. For example: `https://newsapi.org/v2/everything?q=web%20development&apiKey=123456`.

Create your URL, and visit it from the browser. You should see the API return a JSON response. If you're stuck, you can try the [getting started](https://newsapi.org/docs/get-started) page for the news API. Don't follow any of the code examples yet, we will look into this in the next step

## Fetching news articles

Besides displaying UI, web components can also use any of the available javascript APIs. We are going to use the `fetch` function to make an HTTP request to retrieve our news articles. `fetch` is an asynchronous operation, and it costs system resources. We, therefore, need to be a bit more careful about when and how we use it.

`LitElement` has several lifecycle methods available for this, some of them will be familiar to you by now. See [this page](/faq/lit-element-lifecycle.html) for a full overview and reference of all the available lifecycle methods.

We could trigger our `fetch` in the constructor since it's run only once. But because it's a best practice to not perform any side effects there, it's better to use the `connectedCallback.` Because this method can be called multiple times during an element's lifecycle, we should be careful to trigger a `fetch` only when the data hasn't already been fetched before.

### Tasks to complete this step:

- Fetch articles from the news API
- Render the fetched articles as JSON

### Tips

<details>
 <summary>Using fetch</summary>
`fetch` is a browser API for making HTTP requests. It's promise based, and it returns a streaming response. We can turn the the stream into JSON using the `json` function:

```js
async fetchArticles() {
 const response = await fetch('https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}');
 const jsonResponse = await response.json();
 this.articles = jsonResponse.articles;
}
```

If you're not familiar with [async await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), this is what it looks like using `Promise`:

```js
fetchArticles() {
 fetch('https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}')
 .then(response => response.json())
 .then((jsonResponse) => {
 this.articles = jsonResponse.articles;
 });
}
```

</details>

<details>
 <summary>Example connectedCallback</summary>

```js
class NewsApp extends LitElement {
  connectedCallback() {
    super.connectedCallback();

    if (!this.articles) {
      this.fetchArticles();
    }
  }
}
```

</details>

<details>
<summary>Example of articles rendered as JSON</summary>

```js
render() {
 return html`
 <pre>${JSON.stringify(this.articles, null, 2)}</pre>
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
    <news-app></news-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class NewsApp extends LitElement {
        static get properties() {
          return {
            articles: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.articles) {
            this.fetchArticles();
          }
        }

        async fetchArticles() {
          const response = await fetch(
            'https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}',
          );
          const jsonResponse = await response.json();
          this.articles = jsonResponse.articles;
        }

        render() {
          return html`
            <pre>${JSON.stringify(this.articles, null, 2)}</pre>
          `;
        }
      }

      customElements.define('news-app', NewsApp);
    </script>
  </body>
</html>
```

</details>

## Displaying a loading state

Fetching news articles is async, so the first time your `render` function is called they aren't there yet. This isn't a problem right now, because `JSON.stringify` handles null or undefined input. But when we want to start doing things with the articles, our code will crash because the first time `this.articles` is undefined.

We can cover this scenario by preventing the rendering of our main content until the articles are fetched. We can take this opportunity to display a nice loading state for the user as well.

### Tasks to complete this step

- Maintain a boolean indicating whether articles are being fetched
- Display a message while articles are being fetched

<details>
<summary>Maintain a loading state while fetching</summary>

```js
async fetchArticles() {
 this.loading = true;
 const response = await fetch('https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}');
 const jsonResponse = await response.json();
 this.articles = jsonResponse.articles;
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
 <pre>${JSON.stringify(this.articles, null, 2)}</pre>
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
    <news-app></news-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class NewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            articles: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.articles) {
            this.fetchArticles();
          }
        }

        async fetchArticles() {
          this.loading = true;
          const response = await fetch(
            'https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}',
          );
          const jsonResponse = await response.json();
          this.articles = jsonResponse.articles;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          return html`
            <pre>${JSON.stringify(this.articles, null, 2)}</pre>
          `;
        }
      }

      customElements.define('news-app', NewsApp);
    </script>
  </body>
</html>
```

</details>

## Displaying articles

To display individual article it's best to create a new component so that we separate the logic from the main app. This should be a plain UI component, which receives the article data as plain properties to display.

### Tasks to complete this step

- Create a `news-article` element that displays the article's title and description.
- Display a list of `news-article` elements in the `news-app`, one for each article received from the news API.

### Tips

<details>
 <summary>Create an article component</summary>

```js
class NewsArticle extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
    };
  }

  render() {
    return html`
      <h3>${this.title}</h3>
      <p>${this.description}</p>
    `;
  }
}

customElements.define('news-article', NewsArticle);
```

</details>

<details>
<summary>Display a list of articles</summary>

```js
render() {
 return html`
 <ul>
 ${this.articles.map(
 article => html`
 <li>
 <news-article
 .title=${article.title}
 .description=${article.description}
 ></news-article>
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
    <news-app></news-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class NewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            articles: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.articles) {
            this.fetchArticles();
          }
        }

        async fetchArticles() {
          this.loading = true;
          const response = await fetch(
            'https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}',
          );
          const jsonResponse = await response.json();
          this.articles = jsonResponse.articles;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          return html`
            <h1>News App</h1>

            <h2>Articles</h2>
            <ul>
              ${this.articles.map(
                article => html`
                  <li>
                    <news-article
                      .title=${article.title}
                      .description=${article.description}
                    ></news-article>
                  </li>
                `,
              )}
            </ul>
          `;
        }
      }

      customElements.define('news-app', NewsApp);

      class NewsArticle extends LitElement {
        static get properties() {
          return {
            title: { type: String },
            description: { type: String },
          };
        }

        render() {
          return html`
            <h3>${this.title}</h3>
            <p>${this.description}</p>
          `;
        }
      }

      customElements.define('news-article', NewsArticle);
    </script>
  </body>
</html>
```

</details>

## Adding a read/unread toggle

Any serious news app allows the user to track whether or not they have read an article, so let's add this capability to ours as well.

As a start, you can maintain a local property for the read/unread status in the `news-article` component. We will look into lifting this data to the parent component in the next step.

### Tasks to complete this step

- Add a property on the `news-article` component which indicates whether the user has read the article.
- Display the read/unread status in the title of each article.
- Add a button on the `news-article` component to toggle between the read/unread status, storing this status locally.

### Tips

<details>
<summary>Conditional templating</summary>

You can conditionally render something using any valid javascript expression. For simple logic, a ternary operator is sufficient:

```js
render() {
 return html`
 <h3>${this.title} (${this.read ? 'read' : 'unread'})</h3>
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
      My article (${readStatus(this.read)})
    `;
  }
}
```

</details>

<details>
 <summary>Adding event listeners</summary>
With lit-html, you can add event listeners using the `@` syntax, which is just syntax sugar for `addEventListener`:

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
    <news-app></news-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class NewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            articles: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.articles) {
            this.fetchArticles();
          }
        }

        async fetchArticles() {
          this.loading = true;
          const response = await fetch(
            'https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}',
          );
          const jsonResponse = await response.json();
          this.articles = jsonResponse.articles;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          return html`
            <h1>News App</h1>

            <h2>Articles</h2>
            <ul>
              ${this.articles.map(
                article => html`
                  <li>
                    <news-article
                      .title=${article.title}
                      .description=${article.description}
                    ></news-article>
                  </li>
                `,
              )}
            </ul>
          `;
        }
      }

      customElements.define('news-app', NewsApp);

      class NewsArticle extends LitElement {
        static get properties() {
          return {
            title: { type: String },
            description: { type: String },
            read: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.title} (${this.read ? 'read' : 'unread'})</h3>
            <p>${this.description}</p>
            <button @click=${this._toggleReadStatus}>
              Mark as ${this.read ? 'unread' : 'read'}
            </button>
          `;
        }

        _toggleReadStatus() {
          this.read = !this.read;
        }
      }

      customElements.define('news-article', NewsArticle);
    </script>
  </body>
</html>
```

</details>

## Add a read/unread counter

Now that the user can mark articles as read/unread, we want to display the total amount of read and unread items in the app. This counter should be displayed in the `news-app`, but we're storing the read/unread status in the `news-article` component. We need to think of a better way to solve this...

It's best to keep the data in your application flowing in one direction from top to bottom. Parent components are responsible for data of child components, including changing this data.

In our case, the `news-article` component can fire an event to the `news-app` component to request a change in the read/unread status.

### Tasks to complete this step

- Communicate the read/unread status of the article back to the `news-app` component.
- Display the total amount of read and unread articles in the `news-app` component.

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
  ${this.articles.map(
    article => html`
      <li>
        <news-article @toggle-read-status=${() => this._toggleReadStatus(article)}></news-article>
      </li>
    `,
  )}
`;
```

</details>

<details>
 <summary>Update read status in main app</summary>

To update the read status, we need to use immutable data update patterns. This means we should create a articles array, and a new object for the article that was updated. A quick way to do this, is by using a map function:

```js
_toggleReadStatus(articleToUpdate) {
 this.articles = this.articles.map(article => {
 return article === articleToUpdate
 ? { ...article, read: !article.read }
 : article;
 });
}
```

</details>

<details>
 <summary>Calculating derived data</summary>

To display the total amount of read/unread items, we can calculate it on top of the render function:

```js
render() {
 const totalRead = this.articles.filter(a => a.read).length;

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
    <news-app></news-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class NewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            articles: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.articles) {
            this.fetchArticles();
          }
        }

        async fetchArticles() {
          this.loading = true;
          const response = await fetch(
            'https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}',
          );
          const jsonResponse = await response.json();
          this.articles = jsonResponse.articles;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          const totalRead = this.articles.filter(a => a.read).length;
          const totalUnread = this.articles.length - totalRead;

          return html`
            <h1>News App</h1>

            <h2>Articles</h2>
            <p>(${totalRead} read and ${totalUnread} unread)</p>
            <ul>
              ${this.articles.map(
                article => html`
                  <li>
                    <news-article
                      .title=${article.title}
                      .description=${article.description}
                      .read=${article.read}
                      @toggle-read-status=${() => this._toggleReadStatus(article)}
                    ></news-article>
                  </li>
                `,
              )}
            </ul>
          `;
        }

        _toggleReadStatus(articleToUpdate) {
          this.articles = this.articles.map(article => {
            return article === articleToUpdate ? { ...article, read: !article.read } : article;
          });
        }
      }

      customElements.define('news-app', NewsApp);

      class NewsArticle extends LitElement {
        static get properties() {
          return {
            title: { type: String },
            description: { type: String },
            read: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.title} (${this.read ? 'read' : 'unread'})</h3>
            <p>${this.description}</p>
            <button @click=${this._toggleReadStatus}>
              Mark as ${this.read ? 'unread' : 'read'}
            </button>
          `;
        }

        _toggleReadStatus() {
          this.dispatchEvent(new CustomEvent('toggle-read-status'));
        }
      }

      customElements.define('news-article', NewsArticle);
    </script>
  </body>
</html>
```

</details>

## Add a read/unread filter

Now that the `news-app` component knows about the read/unread status, we can do more interesting things like allowing the user to filter based on the article's status.

It's a good practice to separate concerns in your application, and in a real application, such a filter might grow to be quite complex in UI and logic. In those cases, it can be a good idea to separate it into a separate component.

If the functionality is small, like in our example application, we can keep it in the `news-app` component for now.

### Tasks to complete this step

- Add three buttons to the `news-app` component:

- A button which displays only read articles
- A button which displays only unread articles
- A button which displays all articles

### Tips

<details>
 <summary>Creating a filter</summary>

To create a filter, each of the three buttons can update a `filter` property on the element. Changing this property should trigger a re-render.

Then, on the top of your `render` function, you can filter the array of articles using this filter value. Make sure you're using this new array in your template, and not the original array.

</details>

---

<details>
<summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <news-app></news-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class NewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            articles: { type: Array },
            filter: { type: String },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.articles) {
            this.fetchArticles();
          }
        }

        async fetchArticles() {
          this.loading = true;
          const response = await fetch(
            'https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}',
          );
          const jsonResponse = await response.json();
          this.articles = jsonResponse.articles;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          const totalRead = this.articles.filter(a => a.read).length;
          const totalUnread = this.articles.length - totalRead;
          const articles = this.articles.filter(article => {
            if (!this.filter) {
              return true;
            }
            return this.filter === 'read' ? article.read : !article.read;
          });

          return html`
            <h1>News App</h1>

            <h2>Articles</h2>
            <p>(${totalRead} read and ${totalUnread} unread)</p>

            <button @click=${this._filterNone}>Filter none</button>
            <button @click=${this._filterRead}>Filter read</button>
            <button @click=${this._filterUnread}>Filter unread</button>

            <ul>
              ${articles.map(
                article => html`
                  <li>
                    <news-article
                      .title=${article.title}
                      .description=${article.description}
                      .read=${article.read}
                      @toggle-read-status=${() => this.toggleReadStatus(article)}
                    ></news-article>
                  </li>
                `,
              )}
            </ul>
          `;
        }

        toggleReadStatus(articleToUpdate) {
          this.articles = this.articles.map(article => {
            return article === articleToUpdate ? { ...article, read: !article.read } : article;
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

      customElements.define('news-app', NewsApp);

      class NewsArticle extends LitElement {
        static get properties() {
          return {
            title: { type: String },
            description: { type: String },
            read: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.title} (${this.read ? 'read' : 'unread'})</h3>
            <p>${this.description}</p>
            <button @click=${this._toggleReadStatus}>
              Mark as ${this.read ? 'unread' : 'read'}
            </button>
          `;
        }

        _toggleReadStatus() {
          this.dispatchEvent(new CustomEvent('toggle-read-status'));
        }
      }

      customElements.define('news-article', NewsArticle);
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
    <news-app></news-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';
      import 'https://unpkg.com/@material/mwc-button?module';

      class NewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            articles: { type: Array },
            filter: { type: String },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.articles) {
            this.fetchArticles();
          }
        }

        async fetchArticles() {
          this.loading = true;
          const response = await fetch(
            'https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}',
          );
          const jsonResponse = await response.json();
          this.articles = jsonResponse.articles;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          const totalRead = this.articles.filter(a => a.read).length;
          const totalUnread = this.articles.length - totalRead;
          const articles = this.articles.filter(article => {
            if (!this.filter) {
              return true;
            }
            return this.filter === 'read' ? article.read : !article.read;
          });

          return html`
            <h1>News App</h1>

            <h2>Articles</h2>
            <p>(${totalRead} read and ${totalUnread} unread)</p>

            <mwc-button @click=${this._filterNone}>Filter none</mwc-button>
            <mwc-button @click=${this._filterRead}>Filter read</mwc-button>
            <mwc-button @click=${this._filterUnread}>Filter unread</mwc-button>

            <ul>
              ${articles.map(
                article => html`
                  <li>
                    <news-article
                      .title=${article.title}
                      .description=${article.description}
                      .read=${article.read}
                      @toggle-read-status=${() => this.toggleReadStatus(article)}
                    ></news-article>
                  </li>
                `,
              )}
            </ul>
          `;
        }

        toggleReadStatus(articleToUpdate) {
          this.articles = this.articles.map(article => {
            return article === articleToUpdate ? { ...article, read: !article.read } : article;
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

      customElements.define('news-app', NewsApp);

      class NewsArticle extends LitElement {
        static get properties() {
          return {
            title: { type: String },
            description: { type: String },
            read: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.title} (${this.read ? 'read' : 'unread'})</h3>
            <p>${this.description}</p>
            <mwc-button @click=${this._toggleReadStatus}>
              Mark as ${this.read ? 'unread' : 'read'}
            </mwc-button>
          `;
        }

        _toggleReadStatus() {
          this.dispatchEvent(new CustomEvent('toggle-read-status'));
        }
      }

      customElements.define('news-article', NewsArticle);
    </script>
  </body>
</html>
```

</details>

## Template function

For our `news-article` we created a separate web component. A web component creates a strong encapsulation boundary between the parent and child components. This is a great feature, we can develop components in complete isolation.

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

- Replace the `news-article` component with a template function.

### Tips

<details>
 <summary>Handling events in template functions</summary>

We cannot fire any events from the template function. Instead, we should pass along the event handler from the parent component.

```js
function articleTemplate(article, toggleReadStatus) {
  return html`
    <h3>${article.title} (${article.read ? 'read' : 'unread'})</h3>
    <p>${article.description}</p>
    <mwc-button @click=${toggleReadStatus}>
      Mark as ${article.read ? 'unread' : 'read'}
    </mwc-button>
  `;
}
```

Then, to render the template:

```js
html`
  <li>
    ${articleTemplate(article, () => this.toggleReadStatus(article))}
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
    <news-app></news-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';
      import 'https://unpkg.com/@material/mwc-button?module';

      function articleTemplate(article, toggleReadStatus) {
        return html`
          <h3>${article.title} (${article.read ? 'read' : 'unread'})</h3>
          <p>${article.description}</p>
          <mwc-button @click=${toggleReadStatus}>
            Mark as ${article.read ? 'unread' : 'read'}
          </mwc-button>
        `;
      }

      class NewsApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            articles: { type: Array },
            filter: { type: String },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.articles) {
            this.fetchArticles();
          }
        }

        async fetchArticles() {
          this.loading = true;
          const response = await fetch(
            'https://newsapi.org/v2/everything?q={some-topic}&apiKey={your-api-key}',
          );
          const jsonResponse = await response.json();
          this.articles = jsonResponse.articles;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html`
              <p>Loading...</p>
            `;
          }

          const totalRead = this.articles.filter(a => a.read).length;
          const totalUnread = this.articles.length - totalRead;
          const articles = this.articles.filter(article => {
            if (!this.filter) {
              return true;
            }
            return this.filter === 'read' ? article.read : !article.read;
          });

          return html`
            <h1>News App</h1>

            <h2>Articles</h2>
            <p>(${totalRead} read and ${totalUnread} unread)</p>

            <mwc-button @click=${this._filterNone}>Filter none</mwc-button>
            <mwc-button @click=${this._filterRead}>Filter read</mwc-button>
            <mwc-button @click=${this._filterUnread}>Filter unread</mwc-button>

            <ul>
              ${articles.map(
                article => html`
                  <li>
                    ${articleTemplate(article, () => this.toggleReadStatus(article))}
                  </li>
                `,
              )}
            </ul>
          `;
        }

        toggleReadStatus(articleToUpdate) {
          this.articles = this.articles.map(article => {
            return article === articleToUpdate ? { ...article, read: !article.read } : article;
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

      customElements.define('news-app', NewsApp);
    </script>
  </body>
</html>
```

</details>
