# lit-html & lit-element: intermediate

## Introduction

This codelab is a followup from the [lit-html & lit-element basics](https://open-wc.org/codelabs/#web-components-basics) codelab.

[lit-html](https://github.com/Polymer/lit-html) is an efficient, expressive and extensible HTML templating library for JavaScript. It lets you write HTML templates in JavaScript, then efficiently render and re-render those templates together with data to create and update DOM:

[lit-element](https://github.com/Polymer/lit-element) is a simple base class for creating fast and lightweight web components with lit-html.

**What you need**

- A web browser that supports Web Components: Firefox, Safari, Chrome or any Chromium-based browser.
- Intermediate knowledge of HTML and Javascript
- Basic knowledge of web components, see our [basics codelab](https://open-wc.org/codelabs/#web-components-basics) to get you started.
- Basic knowledge of lit-html & lit-element, see our [basics codelab](https://open-wc.org/codelabs/#lit-html--lit-element-basics)
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

Unlike the [basics codelab](https://open-wc.org/codelabs/#lit-html--lit-element-basics), we will not explain the required changes for each step in detail. Instead, we give background information and the desired end-result. In most steps, we offer some tips, most of them hidden behind a toggle.

At the bottom of each section, there is a "View final result" button, this will show you the correct code that you should end up with, in case you get stuck. The steps are sequential, thus results from the previous steps carry over to the next step.

## Setup

In this codelab, we will build a brewery app. This is a great exercise to learn the intermediate parts of lit-html and lit-element.

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

You should already know how to create a web component using `LitElement`. Go ahead and create one which renders '_My brewery app_' to the screen. When it works, you're ready to move on to the next step.

---

<details>
 <summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <brewery-app></brewery-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class BreweryApp extends LitElement {
        render() {
          return html` My brewery app `;
        }
      }

      customElements.define('brewery-app', BreweryApp);
    </script>
  </body>
</html>
```

</details>

## OpenBreweryDB API

For this codelab, we will be fetching data from the api of [Open Brewery DB](https://www.openbrewerydb.org/). Use the url provided to connect and retrieve data from the Open Brewery API `https://api.openbrewerydb.org/breweries`.

Create a variable storing the URL. You can test the URL by visiting it from the browser. You should see the API return a JSON response. The return response object you can expect from the api should look similar to this:

```json
[
  {
    "id": 2,
    "name": "Avondale Brewing Co",
    "brewery_type": "micro",
    "street": "201 41st St S",
    "city": "Birmingham",
    "state": "Alabama",
    "postal_code": "35222-1932",
    "country": "United States",
    "longitude": "-86.774322",
    "latitude": "33.524521",
    "phone": "2057775456",
    "website_url": "http://www.avondalebrewing.com",
    "updated_at": "2018-08-23T23:19:57.825Z",
    "tag_list": []
  },
  "..."
]
```

<aside class="notice">
If you're stuck, you can <a href="https://www.openbrewerydb.org/documentation/01-listbreweries">read the documentation</a> on the Open Brewery DB website.
</aside>

## Fetching breweries

Besides displaying UI, web components can also use any of the available javascript APIs. We are going to use the `fetch` function to make an HTTP request to retrieve a list of breweries. `fetch` is an asynchronous operation, and it costs system resources. We, therefore, need to be a bit more careful about when and how we use it.

`LitElement` has several lifecycle methods available for this, some of them will be familiar to you by now. See [this page](/guides/knowledge/lit-element/lifecycle/index.html) for a full overview and reference of all the available lifecycle methods.

We could trigger our `fetch` in the constructor since it's run only once. But because it's a best practice to not perform any side effects there, it's better to use the `connectedCallback.` Because this method can be called multiple times during an element's lifecycle, we should be careful to trigger a `fetch` only when the data hasn't already been fetched before.

### Tasks to complete this step:

- Fetch breweries from the OpenBreweryDB API
- Render the fetched breweries as JSON

### Tips

<details>
 <summary>Using fetch</summary>
<code>fetch</code> is a browser API for making HTTP requests. It's promise based, and it returns a streaming response. We can turn the the stream into JSON using the <code>json</code> function:

```js
async fetchBreweries() {
  const response = await fetch('https://api.openbrewerydb.org/breweries');
  const jsonResponse = await response.json();
  this.breweries = jsonResponse;
}
```

If you're not familiar with [async await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), this is what it looks like using `Promise`:

```js
fetchBreweries() {
  fetch('https://api.openbrewerydb.org/breweries')
    .then(response => response.json())
    .then((jsonResponse) => {
      this.breweries = jsonResponse;
    });
}
```

</details>

<details>
 <summary>Example connectedCallback</summary>

```js
class BreweryApp extends LitElement {
  connectedCallback() {
    super.connectedCallback();

    if (!this.breweries) {
      this.fetchBreweries();
    }
  }
}
```

</details>

<details>
<summary>Example of breweries rendered as JSON</summary>

```js
render() {
  return html`
    <pre>${JSON.stringify(this.breweries, null, 2)}</pre>
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
    <brewery-app></brewery-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class BreweryApp extends LitElement {
        static get properties() {
          return {
            breweries: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.breweries) {
            this.fetchBreweries();
          }
        }

        async fetchBreweries() {
          const response = await fetch('https://api.openbrewerydb.org/breweries');
          const jsonResponse = await response.json();
          this.breweries = jsonResponse;
        }

        render() {
          return html` <pre>${JSON.stringify(this.breweries, null, 2)}</pre> `;
        }
      }

      customElements.define('brewery-app', BreweryApp);
    </script>
  </body>
</html>
```

</details>

## Displaying a loading state

Fetching the breweries is async, so the first time your `render` function is called they aren't there yet. This isn't a problem right now, because `JSON.stringify` handles null or undefined input. But when we want to start doing things with the list of breweries, our code will crash because the first time `this.breweries` is undefined.

We can cover this scenario by preventing the rendering of our main content until the list of breweries are fetched. We can take this opportunity to display a nice loading state for the user as well.

### Tasks to complete this step

- Maintain a boolean indicating whether the list of breweries are being fetched
- Display a message while the list of breweries are being fetched

<details>
<summary>Maintain a loading state while fetching</summary>

```js
async fetchBreweries() {
  this.loading = true;
  const response = await fetch('https://api.openbrewerydb.org/breweries');
  const jsonResponse = await response.json();
  this.breweries = jsonResponse;
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
    <pre>${JSON.stringify(this.breweries, null, 2)}</pre>
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
    <brewery-app></brewery-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class BreweryApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            breweries: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.breweries) {
            this.fetchBreweries();
          }
        }

        async fetchBreweries() {
          this.loading = true;
          const response = await fetch('https://api.openbrewerydb.org/breweries');
          const jsonResponse = await response.json();
          this.breweries = jsonResponse;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html` <p>Loading...</p> `;
          }

          return html` <pre>${JSON.stringify(this.breweries, null, 2)}</pre> `;
        }
      }

      customElements.define('brewery-app', BreweryApp);
    </script>
  </body>
</html>
```

</details>

## Displaying breweries

To display individual breweries it's best to create a new component so that we separate the logic from the main app. This should be a plain UI component, which receives the brewery data as plain properties to display.

### Tasks to complete this step

- Create a `brewery-detail` element that displays the brewery's name, type and city.
- Display a list of `brewery-detail` elements in the `brewery-app`, one for each brewery received from the OpenBreweryDB API.

### Tips

<details>
 <summary>Create an brewery component</summary>

```js
class BreweryDetail extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      type: { type: String },
      city: { type: String },
    };
  }

  render() {
    return html`
      <h3>${this.name}</h3>
      <p>brewery type: ${this.type}</p>
      <p>city: ${this.city}</p>
    `;
  }
}

customElements.define('brewery-detail', BreweryDetail);
```

</details>

<details>
<summary>Display a list of breweries</summary>

```js
render() {
  return html`
    <ul>
      ${this.breweries.map(
        brewery => html`
          <li>
            <brewery-detail
              .name=${brewery.name}
              .type=${brewery.brewery_type}
              .city=${brewery.city}
            ></brewery-detail>
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
    <brewery-app></brewery-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class BreweryApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            breweries: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.breweries) {
            this.fetchBreweries();
          }
        }

        async fetchBreweries() {
          this.loading = true;
          const response = await fetch('https://api.openbrewerydb.org/breweries');
          const jsonResponse = await response.json();
          this.breweries = jsonResponse;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html` <p>Loading...</p> `;
          }

          return html`
            <h1>Breweries App</h1>

            <h2>Breweries</h2>
            <ul>
              ${this.breweries.map(
                brewery => html`
                  <li>
                    <brewery-detail
                      .name=${brewery.name}
                      .type=${brewery.brewery_type}
                      .city=${brewery.city}
                    ></brewery-detail>
                  </li>
                `,
              )}
            </ul>
          `;
        }
      }

      customElements.define('brewery-app', BreweryApp);

      class BreweryDetail extends LitElement {
        static get properties() {
          return {
            name: { type: String },
            type: { type: String },
            city: { type: String },
          };
        }

        render() {
          return html`
            <h3>${this.name}</h3>
            <p>brewery type: ${this.type}</p>
            <p>city: ${this.city}</p>
          `;
        }
      }

      customElements.define('brewery-detail', BreweryDetail);
    </script>
  </body>
</html>
```

</details>

## Adding a visited/not-visited toggle

On a brewery tour it's useful to know which brewery has already been visited. To allow the user to track whether or not they have already visited a brewery we need a button, so the user can click to mark they have visited the brewery.

As a start, you can maintain a local property for the visited/not-visited status in the `brewery-detail` component. We will look into lifting this data to the parent component in the next step.

### Tasks to complete this step

- Add a property on the `brewery-detail` component which indicates whether the user has visited the brewery.
- Display the visited/not-visited status in the name of each brewery.
- Add a button on the `brewery-detail` component to toggle between the visited/not-visited status, storing this status locally.

### Tips

<details>
<summary>Conditional templating</summary>

You can conditionally render something using any valid javascript expression. For simple logic, a ternary operator is sufficient:

```js
render() {
  return html`
    <h3>${this.name} (${this.visited ? 'visited' : 'not-visited'})</h3>
  `;
}
```

If the logic is a bit more complex, separating this into a pure function is very useful. The advantage here is that we can use regular if statements, so we don't need to squash everything into a single expression:

```js
function visitedStatus(visited) {
  if (visited) {
    return '(visited)';
  }

  return '(not-visited)';
}

class MyBrewery extends LitElement {
  render() {
    return html` Bendërbrāu ${visitedStatus(this.visited)} `;
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
    <brewery-app></brewery-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class BreweryApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            breweries: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.breweries) {
            this.fetchBreweries();
          }
        }

        async fetchBreweries() {
          this.loading = true;
          const response = await fetch('https://api.openbrewerydb.org/breweries');
          const jsonResponse = await response.json();
          this.breweries = jsonResponse;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html` <p>Loading...</p> `;
          }

          return html`
            <h1>Breweries App</h1>

            <h2>Breweries</h2>
            <ul>
              ${this.breweries.map(
                brewery => html`
                  <li>
                    <brewery-detail
                      .name=${brewery.name}
                      .type=${brewery.brewery_type}
                      .city=${brewery.city}
                      .visited=${brewery.visited}
                    ></brewery-detail>
                  </li>
                `,
              )}
            </ul>
          `;
        }
      }

      customElements.define('brewery-app', BreweryApp);

      class BreweryDetail extends LitElement {
        static get properties() {
          return {
            name: { type: String },
            type: { type: String },
            city: { type: String },
            visited: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.name} (${this.visited ? 'visited' : 'not-visited'})</h3>
            <p>brewery type: ${this.type}</p>
            <p>city: ${this.city}</p>
            <button @click=${this._toggleVisitedStatus}>
              Mark as ${this.visited ? 'not-visited' : 'visited'}
            </button>
          `;
        }

        _toggleVisitedStatus() {
          this.visited = !this.visited;
        }
      }

      customElements.define('brewery-detail', BreweryDetail);
    </script>
  </body>
</html>
```

</details>

## Add a visited/not-visited counter

Now that the user can mark breweries as visited/not-visited, we want to display the total amount of visited breweries and the breweries that still need to be visited in the app. This counter should be displayed in the `brewery-app`, but we're storing the visited/not-visited status in the `brewery-detail` component. We need to think of a better way to solve this...

It's best to keep the data in your application flowing in one direction from top to bottom. Parent components are responsible for data of child components, including changing this data.

In our case, the `brewery-detail` component can fire an event to the `brewery-app` component to request a change in the visited/not-visited status.

### Tasks to complete this step

- Communicate the visited/not-visited status of the brewery back to the `brewery-app` component.
- Display the total amount of visited breweries and the breweries that still need to be visited in the `brewery-app` component.

### Tips

Remember that with `LitElement`, you need to use immutable data patterns. Otherwise, it will not be able to pick up data changes.

<details>
 <summary>Firing events</summary>

```js
_toggleVisitedStatus() {
  this.dispatchEvent(new CustomEvent('toggle-visited-status'));
}
```

</details>

<details>
 <summary>Catch event from a list of elements</summary>

When you add an event listener on an element in a list of templates, you need a way to know which element in the list fired the event. This can be done by passing the list item to the event handler:

```js
html`
  ${this.breweries.map(
    brewery => html`
      <li>
        <brewery-detail
          @toggle-visited-status=${() => this._toggleVisitedStatus(brewery)}
        ></brewery-detail>
      </li>
    `,
  )}
`;
```

</details>

<details>
 <summary>Update visited status in main app</summary>

To update the visited status, we need to use immutable data update patterns. This means we should create a breweries array, and a new object for the brewery that was updated. A quick way to do this, is by using a map function:

```js
_toggleVisitedStatus(breweryToUpdate) {
  this.breweries = this.breweries.map(brewery => {
    return brewery === breweryToUpdate ? { ...brewery, visited: !brewery.visted } : brewery;
  });
}
```

</details>

<details>
 <summary>Calculating derived data</summary>

To display the total amount of visisted/not-visited breweries, we can calculate it on top of the render function:

```js
render() {
 const totalVisited = this.breweries.filter(b => b.visited).length;

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
    <brewery-app></brewery-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class BreweryApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            breweries: { type: Array },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.breweries) {
            this.fetchBreweries();
          }
        }

        async fetchBreweries() {
          this.loading = true;
          const response = await fetch('https://api.openbrewerydb.org/breweries');
          const jsonResponse = await response.json();
          this.breweries = jsonResponse;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html` <p>Loading...</p> `;
          }

          const totalVisited = this.breweries.filter(b => b.visited).length;
          const totalNotVisited = this.breweries.length - totalVisited;

          return html`
            <h1>Breweries App</h1>

            <h2>Breweries</h2>
            <p>(${totalVisited} visited and ${totalNotVisited} still to go)</p>
            <ul>
              ${this.breweries.map(
                brewery => html`
                  <li>
                    <brewery-detail
                      .name=${brewery.name}
                      .type=${brewery.brewery_type}
                      .city=${brewery.city}
                      .visited=${brewery.visited}
                      @toggle-visited-status=${() => this._toggleVisitedStatus(brewery)}
                    ></brewery-detail>
                  </li>
                `,
              )}
            </ul>
          `;
        }

        _toggleVisitedStatus(breweryToUpdate) {
          this.breweries = this.breweries.map(brewery => {
            return brewery === breweryToUpdate
              ? { ...brewery, visited: !brewery.visited }
              : brewery;
          });
        }
      }

      customElements.define('brewery-app', BreweryApp);

      class BreweryDetail extends LitElement {
        static get properties() {
          return {
            name: { type: String },
            type: { type: String },
            city: { type: String },
            visited: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.name} (${this.visited ? 'visited' : 'not-visited'})</h3>
            <p>brewery type: ${this.type}</p>
            <p>city: ${this.city}</p>
            <button @click=${this._toggleVisitedStatus}>
              Mark as ${this.visited ? 'not-visited' : 'visited'}
            </button>
          `;
        }

        _toggleVisitedStatus() {
          this.dispatchEvent(new CustomEvent('toggle-visited-status'));
        }
      }

      customElements.define('brewery-detail', BreweryDetail);
    </script>
  </body>
</html>
```

</details>

## Add a visited/not-visited filter

Now that the `brewery-app` component knows about the visited/not-visited status, we can do more interesting things like allowing the user to filter based on the brewery's status.

It's a good practice to separate concerns in your application, and in a real application, such a filter might grow to be quite complex in UI and logic. In those cases, it can be a good idea to separate it into a separate component.

If the functionality is small, like in our example application, we can keep it in the `brewery-app` component for now.

### Tasks to complete this step

- Add three buttons to the `brewery-app` component:
  - A button which displays only visited breweries
  - A button which displays only not-visited breweries
  - A button which displays all breweries

### Tips

<details>
 <summary>Creating a filter</summary>

To create a filter, each of the three buttons can update a `filter` property on the element. Changing this property should trigger a re-render.

Then, on the top of your `render` function, you can filter the array of breweries using this filter value. Make sure you're using this new array in your template, and not the original array.

</details>

---

<details>
<summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <brewery-app></brewery-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';

      class BreweryApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            breweries: { type: Array },
            filter: { type: String },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.breweries) {
            this.fetchBreweries();
          }
        }

        async fetchBreweries() {
          this.loading = true;
          const response = await fetch('https://api.openbrewerydb.org/breweries');
          const jsonResponse = await response.json();
          this.breweries = jsonResponse;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html` <p>Loading...</p> `;
          }

          const totalVisited = this.breweries.filter(b => b.visited).length;
          const totalNotVisted = this.breweries.length - totalVisited;
          const breweries = this.breweries.filter(brewery => {
            if (!this.filter) {
              return true;
            }
            return this.filter === 'visited' ? brewery.visited : !brewery.visited;
          });

          return html`
            <h1>Breweries App</h1>

            <h2>Breweries</h2>
            <p>(${totalVisited} visited and ${totalNotVisted} still to go)</p>

            <button @click=${this._filterNone}>Filter none</button>
            <button @click=${this._filterVisited}>Filter visited</button>
            <button @click=${this._filterNotVisited}>Filter not-visited</button>

            <ul>
              ${breweries.map(
                brewery => html`
                  <li>
                    <brewery-detail
                      .name=${brewery.name}
                      .type=${brewery.brewery_type}
                      .city=${brewery.city}
                      .visited=${brewery.visited}
                      @toggle-visited-status=${() => this.toggleVisitedStatus(brewery)}
                    ></brewery-detail>
                  </li>
                `,
              )}
            </ul>
          `;
        }

        toggleVisitedStatus(breweryToUpdate) {
          this.breweries = this.breweries.map(brewery => {
            return brewery === breweryToUpdate
              ? { ...brewery, visited: !brewery.visited }
              : brewery;
          });
        }

        _filterNone() {
          this.filter = null;
        }

        _filterVisited() {
          this.filter = 'visited';
        }

        _filterNotVisited() {
          this.filter = 'not-visited';
        }
      }

      customElements.define('brewery-app', BreweryApp);

      class BreweryDetail extends LitElement {
        static get properties() {
          return {
            name: { type: String },
            type: { type: String },
            city: { type: String },
            visited: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.name} (${this.visited ? 'visited' : 'not-visited'})</h3>
            <p>brewery type: ${this.type}</p>
            <p>city: ${this.city}</p>
            <button @click=${this._toggleVisitedStatus}>
              Mark as ${this.visited ? 'not-visited' : 'visited'}
            </button>
          `;
        }

        _toggleVisitedStatus() {
          this.dispatchEvent(new CustomEvent('toggle-visited-status'));
        }
      }

      customElements.define('brewery-detail', BreweryDetail);
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
  <button @click=${this._filterVisited}>Filter visited</button>
  <button @click=${this._filterNotVisited}>Filter not-visited</button>
`;
```

To:

```js
html`
  <mwc-button @click=${this._filterNone}>Filter none</mwc-button>
  <mwc-button @click=${this._filterVisited}>Filter visited</mwc-button>
  <mwc-button @click=${this._filterNotVisited}>Filter not-visited</mwc-button>
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
    <brewery-app></brewery-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';
      import 'https://unpkg.com/@material/mwc-button?module';

      class BreweryApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            breweries: { type: Array },
            filter: { type: String },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.breweries) {
            this.fetchBreweries();
          }
        }

        async fetchBreweries() {
          this.loading = true;
          const response = await fetch('https://api.openbrewerydb.org/breweries');
          const jsonResponse = await response.json();
          this.breweries = jsonResponse;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html` <p>Loading...</p> `;
          }

          const totalVisited = this.breweries.filter(b => b.visited).length;
          const totalNotVisited = this.breweries.length - totalVisited;
          const breweries = this.breweries.filter(brewery => {
            if (!this.filter) {
              return true;
            }
            return this.filter === 'visited' ? brewery.visited : !brewery.visited;
          });

          return html`
            <h1>Breweries App</h1>

            <h2>Breweries</h2>
            <p>(${totalVisited} visited and ${totalNotVisited} still to go)</p>

            <mwc-button @click=${this._filterNone}>Filter none</mwc-button>
            <mwc-button @click=${this._filterVisited}>Filter visited</mwc-button>
            <mwc-button @click=${this._filterNotVisited}>Filter not-visited</mwc-button>

            <ul>
              ${breweries.map(
                brewery => html`
                  <li>
                    <brewery-detail
                      .name=${brewery.name}
                      .type=${brewery.brewery_type}
                      .city=${brewery.city}
                      .visited=${brewery.visited}
                      @toggle-visited-status=${() => this.toggleVisitedStatus(brewery)}
                    ></brewery-detail>
                  </li>
                `,
              )}
            </ul>
          `;
        }

        toggleVisitedStatus(breweryToUpdate) {
          this.breweries = this.breweries.map(brewery => {
            return brewery === breweryToUpdate
              ? { ...brewery, visited: !brewery.visited }
              : brewery;
          });
        }

        _filterNone() {
          this.filter = null;
        }

        _filterVisited() {
          this.filter = 'visited';
        }

        _filterNotVisited() {
          this.filter = 'not-visited';
        }
      }

      customElements.define('brewery-app', BreweryApp);

      class BreweryDetail extends LitElement {
        static get properties() {
          return {
            name: { type: String },
            type: { type: String },
            city: { type: String },
            visited: { type: Boolean },
          };
        }

        render() {
          return html`
            <h3>${this.name} (${this.visited ? 'visited' : 'not-visited'})</h3>
            <p>brewery type: ${this.type}</p>
            <p>city: ${this.city}</p>
            <mwc-button @click=${this._toggleVisitedStatus}>
              Mark as ${this.visited ? 'not-visited' : 'visited'}
            </mwc-button>
          `;
        }

        _toggleVisitedStatus() {
          this.dispatchEvent(new CustomEvent('toggle-visited-status'));
        }
      }

      customElements.define('brewery-detail', BreweryDetail);
    </script>
  </body>
</html>
```

</details>

## Template function

For our `brewery-detail` we created a separate web component. A web component creates a strong encapsulation boundary between the parent and child components. This is a great feature, we can develop components in complete isolation.

But sometimes this can be overkill for just simple templates, or we may want to have no boundaries so that we can share styles or select DOM nodes.

Since lit-html templates are actual javascript variables, we could write our template as a function which returns our template:

```js
function BeerTemplate(beer) {
  return html` <h1>${beer}</h1> `;
}
```

### Tasks to complete this step

- Replace the `brewery-detail` component with a template function.

### Tips

<details>
 <summary>Handling events in template functions</summary>

We cannot fire any events from the template function. Instead, we should pass along the event handler from the parent component.

```js
function breweryTemplate(brewery, toggleVisitedStatus) {
  return html`
    <h3>${brewery.name} (${brewery.visited ? 'visited' : 'not-visited'})</h3>
    <p>brewery type: ${brewery.brewery_type}</p>
    <p>city: ${brewery.city}</p>
    <mwc-button @click=${toggleVisitedStatus}>
      Mark as ${brewery.visited ? 'not-visited' : 'visited'}
    </mwc-button>
  `;
}
```

Then, to render the template:

```js
html` <li>${breweryTemplate(brewery, () => this.toggleVisitedStatus(brewery))}</li> `;
```

</details>

---

<details>
<summary>View final result</summary>

```html
<!DOCTYPE html>
<html>
  <body>
    <brewery-app></brewery-app>

    <script type="module">
      import { LitElement, html } from 'https://unpkg.com/lit-element?module';
      import 'https://unpkg.com/@material/mwc-button?module';

      function breweryTemplate(brewery, toggleVisitedStatus) {
        return html`
          <h3>${brewery.name} (${brewery.visited ? 'visited' : 'not-visited'})</h3>
          <p>brewery type: ${brewery.brewery_type}</p>
          <p>city: ${brewery.city}</p>
          <mwc-button @click=${toggleVisitedStatus}>
            Mark as ${brewery.visited ? 'not-visited' : 'visited'}
          </mwc-button>
        `;
      }

      class BreweryApp extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean },
            breweries: { type: Array },
            filter: { type: String },
          };
        }

        connectedCallback() {
          super.connectedCallback();

          if (!this.breweries) {
            this.fetchBreweries();
          }
        }

        async fetchBreweries() {
          this.loading = true;
          const response = await fetch('https://api.openbrewerydb.org/breweries');
          const jsonResponse = await response.json();
          this.breweries = jsonResponse;
          this.loading = false;
        }

        render() {
          if (this.loading) {
            return html` <p>Loading...</p> `;
          }

          const totalVisited = this.breweries.filter(b => b.visited).length;
          const totalNotVisited = this.breweries.length - totalVisited;
          const breweries = this.breweries.filter(brewery => {
            if (!this.filter) {
              return true;
            }
            return this.filter === 'visited' ? brewery.visited : !brewery.visited;
          });

          return html`
            <h1>Breweries App</h1>

            <h2>Breweries</h2>
            <p>(${totalVisited} visited and ${totalNotVisited} still to go)</p>

            <mwc-button @click=${this._filterNone}>Filter none</mwc-button>
            <mwc-button @click=${this._filterVisited}>Filter visited</mwc-button>
            <mwc-button @click=${this._filterNotVisited}>Filter not-visited</mwc-button>

            <ul>
              ${breweries.map(
                brewery => html`
                  <li>${breweryTemplate(brewery, () => this.toggleVisitedStatus(brewery))}</li>
                `,
              )}
            </ul>
          `;
        }

        toggleVisitedStatus(breweryToUpdate) {
          this.breweries = this.breweries.map(brewery => {
            return brewery === breweryToUpdate
              ? { ...brewery, visited: !brewery.visited }
              : brewery;
          });
        }

        _filterNone() {
          this.filter = null;
        }

        _filterVisited() {
          this.filter = 'visited';
        }

        _filterNotVisited() {
          this.filter = 'not-visited';
        }
      }

      customElements.define('brewery-app', BreweryApp);
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
