# Tools >> Web Component DevTools

While the developer tools provided by modern browsers are effective, they aren't completely tailored for Web Component development.

Attributes can be viewed in the devtools Element window, but modifying them can get quite cumbersome, especially if you're adding a new attribute.

A more tailored set of tooling has been created going by the name Web Component DevTools.

## Features

Web Component DevTools provides advanced features to the developer, straight from the browser's UI to, for example:

- Listing custom elements on the page, and accessible iframes inside the page
- Filtering custom elements on the list
- Inspecting and modifying the attributes of custom elements
- \*Inspecting and modifying the properties of custom elements
- \*Observing dispatched events
- \*Calling functions of the custom element

-\* Feature is limited to [supported libraries](#supported-libraries) and projects with a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest).

**_For the best development experience it is recommended to integrate a Custom Elements analyzer to the project, so that the elements get analyzed on file changes, generating a up-to-date manifest for the devtools to use._**

An example development setup of a [Modern Web Dev Server](https://modern-web.dev/docs/dev-server/overview/) paired with a CEM analyzer would look like this:

```json
{
  "scripts": {
    "start": "concurrently \"wds\" \"cem analyze --watch\""
  },
  "devDependencies": {
    "@custom-elements-manifest/analyzer": "^0.4.11",
    "@web/dev-server": "^0.1.18",
    "concurrently": "^6.2.0"
  }
}
```

### Supported libraries

Web Component DevTools also works with libraries built for developing Web Components. Currently the libraries, with extra support by DevTools are:

- [Lit](https://github.com/lit/lit/)
- [FAST](https://www.fast.design/)
- [Atomico](https://atomicojs.github.io/)

When developing with these libraries, the feature set of the devtools is increased, without the addition of the Custom Elements Manifest.

Extra features provided for these libraries include for example inspecting and editing of the properties of custom elements.

The list of extra support libraries will grow as adoption grows

## Download

You can get the Web Component DevTools from the [Chrome Web Store](https://chrome.google.com/webstore/detail/web-component-devtools/gdniinfdlmmmjpnhgnkmfpffipenjljo/related)

### Setting up

A brief video of showcasing and setting up your development environment to get the most out of DevTools can be found [in Youtube](https://youtu.be/D6W5iX3-E9E)
