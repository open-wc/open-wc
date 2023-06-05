# Lit: intermediate

## Introduction

This codelab is a followup from the [Lit basics](https://open-wc.org/codelabs/#lit-basics) codelab.

[lit-html](https://github.com/Polymer/Lit) is an efficient, expressive and extensible HTML templating library for JavaScript. It lets you write HTML templates in JavaScript, then efficiently render and re-render those templates together with data to create and update DOM:

[lit-element](https://github.com/Polymer/lit-element) is a simple base class for creating fast and lightweight web components with Lit.

**What you need**

- A web browser that supports Web Components: Firefox, Safari, Chrome or any Chromium-based browser.
- Intermediate knowledge of HTML and Javascript
- Basic knowledge of web components, see our [basics codelab](https://open-wc.org/codelabs/#web-components-basics) to get you started.
- Basic knowledge of Lit & lit-element, see our [basics codelab](https://open-wc.org/codelabs/#Lit--lit-element-basics)
- Familiarity with the following concepts:
  - [Javascript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
  - [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
  - [Array filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
  - [Array map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
  - [Object & array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
  - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  - [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

**What you'll learn**

- Connecting your web component to an API
- Handling asynchronous rendering
- Complex templating
- Using third-party components
- Creating Lit template functions

**How it works**

Unlike the [basics codelab](https://open-wc.org/codelabs/#Lit--lit-element-basics), we will not explain the required changes for each step in detail. Instead, we give background information and the desired end-result. In most steps, we offer some tips, most of them hidden behind a toggle.

At the bottom of each section, there is a "View final result" button, this will show you the correct code that you should end up with, in case you get stuck. The steps are sequential, thus results from the previous steps carry over to the next step.

## Setup

In this codelab we will build a brewery app, using a public API as data source. This is a great exercise to learn the intermediate parts of Lit and lit-element.

You can follow this codelab using anything that is able to display a simple HTML page. We recommend using an online code editor so that you don't need to bother with all the setup. But you can use a local editor as well.

All our examples are shown using Javascript, but Lit supports Typescript as well.

### Recommended setup

The code editor we recommend is [webcomponents.dev](https://webcomponents.dev/). You can use these links to quickly start a new project:

- [Lit with Javascript](https://studio.webcomponents.dev/create/lit+js)
- [Lit with Typescript](https://studio.webcomponents.dev/create/lit+ts)

If instead you are creating a new project from the website, make sure to select Lit from the "Libraries" section and not the "HTMLElement based" section.

### Other setup

If you are using another editor, you need to set up a basic `index.html` which loads your component:

```html
<!DOCTYPE html>
<html>
  <body>
    My app

    <!-- 
      this is a refernece in the HTML to your web component, 
      make sure to update it based on the name you have given your component 
    -->
    <my-app></my-app>

    <script type="module" src="./src/index.js"></script>
  </body>
</html>
```

To make following further instructions easier, it's recommended to write your JS code in a `src/index.js` file to match the webcomponents.dev setup.

## Code editor setup

<aside class="notice">
  The rest of this codelab assumes you are using the recommended setup using [webcomponents.dev](https://webcomponents.dev/).
  If you are using something else, you might need to take some additional or different steps to make it work.
</aside>

The webcomponents.dev editor creates a few files for you. We will be working only with `src/index.js` and `www/index.html`.

In the `src/index.js` file there is already some code with an example element. For the sake of this tutorial, let's empty this file and start over from scratch. We can leave the `www/index.html` file as is.

The editor also shows three tabs on the right side of the screen. We will only be using the "Website" tab. If you want, you could delete the `stories/index.stories.js` and `README.md` so that the other tabs disappear.

You should already know how to create a web component using `LitElement`. Go ahead and create one which renders '_My brewery app_' to the screen. When it works, you're ready to move on to the next step.

---

<details>
 <summary>View final result</summary>

`www/index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <script src="./dist/index.js" type="module"></script>
  </head>

  <body>
    <brewery-app></brewery-app>
  </body>
</html>
```

`src/index.js`:

```js
import { LitElement, html } from 'lit';

class BreweryApp extends LitElement {
  render() {
    return html`My brewery app`;
  }
}

customElements.define('brewery-app', BreweryApp);
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

```js
import { LitElement, html } from 'lit';

class BreweryApp extends LitElement {
  static properties = {
    breweries: { type: Array },
  };

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

```js
import { LitElement, html } from 'lit';

class BreweryApp extends LitElement {
  static properties = {
    loading: { type: Boolean },
    breweries: { type: Array },
  };

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
```

</details>

## Displaying breweries

To display individual breweries it's best to create a new component so that we separate the logic from the main app. This should be a plain UI component, which receives the brewery data as plain properties to display.

### Tasks to complete this step

- Ceate a new file called `BreweryDetail.js`
- Create a `brewery-detail` element that displays the brewery's name, type and city.
- Import the `BreweryDetail` component inside the `BreweryApp`
- Display a list of `brewery-detail` elements in the `brewery-app`, one for each brewery received from the OpenBreweryDB API.

### Tips

<details>
 <summary>Create an brewery component</summary>

```js
class BreweryDetail extends LitElement {
  static properties = {
    name: { type: String },
    type: { type: String },
    city: { type: String },
  };

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

```js
import { LitElement, html } from 'lit';
import './BreweryDetail.js';

class BreweryApp extends LitElement {
  static properties = {
    loading: { type: Boolean },
    breweries: { type: Array },
  };

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
```

```js
import { LitElement, html } from 'lit';

class BreweryDetail extends LitElement {
  static properties = {
    name: { type: String },
    type: { type: String },
    city: { type: String },
  };

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
With Lit, you can add event listeners using the <code>@</code> syntax, which is just syntax sugar for `addEventListener`:

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

```js
import { LitElement, html } from 'lit';
import './BreweryDetail.js';

class BreweryApp extends LitElement {
  static properties = {
    loading: { type: Boolean },
    breweries: { type: Array },
  };

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
```

```js
import { LitElement, html } from 'lit';

class BreweryDetail extends LitElement {
  static properties = {
    name: { type: String },
    type: { type: String },
    city: { type: String },
    visited: { type: Boolean },
  };

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

```js
import { LitElement, html } from 'lit';
import './BreweryDetail.js';

class BreweryApp extends LitElement {
  static properties = {
    loading: { type: Boolean },
    breweries: { type: Array },
  };

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
      return brewery === breweryToUpdate ? { ...brewery, visited: !brewery.visited } : brewery;
    });
  }
}

customElements.define('brewery-app', BreweryApp);
```

```js
import { LitElement, html } from 'lit';

class BreweryDetail extends LitElement {
  static properties = {
    name: { type: String },
    type: { type: String },
    city: { type: String },
    visited: { type: Boolean },
  };

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

```js
import { LitElement, html } from 'lit';
import './BreweryDetail.js';

class BreweryApp extends LitElement {
  static properties = {
      loading: { type: Boolean },
      breweries: { type: Array },
      filter: { type: String },
    };


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
      return brewery === breweryToUpdate ? { ...brewery, visited: !brewery.visited } : brewery;
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
```

```js
import { LitElement, html } from 'lit';

class BreweryDetail extends LitElement {
  static properties = {
    name: { type: String },
    type: { type: String },
    city: { type: String },
    visited: { type: Boolean },
  };

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
import '@material/mwc-button';
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

```js
import { LitElement, html } from 'lit';
import '@material/mwc-button';
import './BreweryDetail.js';

class BreweryApp extends LitElement {
  static properties = {
    loading: { type: Boolean },
    breweries: { type: Array },
    filter: { type: String },
  };

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
      return brewery === breweryToUpdate ? { ...brewery, visited: !brewery.visited } : brewery;
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
```

```js
import { LitElement, html } from 'lit';

class BreweryDetail extends LitElement {
  static properties = {
    name: { type: String },
    type: { type: String },
    city: { type: String },
    visited: { type: Boolean },
  };

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
```

</details>

## Styling

As a final assignment we will add some styling to our app. To add styles to a LitElement, we have to import the `css` template tag and apply it to a static `styles` property:

```js
import { LitElement, html, css } from 'lit';

class MyElement extends LitElement {
  static styles = css`
    h1 {
      color: blue;
    }
  `;
}
```

`LitElement` uses Shadow DOM by default. This is a native browser feature which scopes any styles to the web component itself. This makes it completely safe to use simple selectors such as HTML tag names. The styles will only ever affect the elements inside the web component.

### Tasks to complete this step

- Apply styling to the BreweryApp element
- Apply styling to the BreweryDetail element

<details>
<summary>View final result</summary>

```js
import { LitElement, html, css } from 'lit';
import '@material/mwc-button';
import './BreweryDetail.js';

class BreweryApp extends LitElement {
  static properties = {
    loading: { type: Boolean },
    breweries: { type: Array },
    filter: { type: String },
  };

  static styles = css`
    h1 {
      color: blue;
    }

    p {
      color: blue;
    }
  `;

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
      return brewery === breweryToUpdate ? { ...brewery, visited: !brewery.visited } : brewery;
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
```

```js
import { LitElement, html, css } from 'lit';

class BreweryDetail extends LitElement {
  static properties = {
    name: { type: String },
    type: { type: String },
    city: { type: String },
    visited: { type: Boolean },
  };

  static styles = css`
    h1 {
      color: red;
    }

    p {
      color: red;
    }
  `;

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
```

</details>

## Wrapping up

That's the end of the intermediate Lit codelab! If you're eager to learn more, you can take a look at the following resources:

- [Lit official docs](https://Lit.polymer-project.org/)
- [lit-element official docs](https://lit-element.polymer-project.org/)
- [open-wc code samples](https://open-wc.org/developing/code-examples.html)
- [IDE help](https://open-wc.org/developing/ide.html)

To get started with your own project we recommend using open-wc's project scaffolding, it's easy to set it up using this command:

```bash
npm init @open-wc
```
