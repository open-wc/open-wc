# Dev server

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

A simple web server for simple web developers. Does the minimal amount of work required for web development on modern web browsers. Specifically designed to work with the native es module loader available in all major browsers.

### Resolves node-style module imports to browser-style
Browsers only accept fully resolved paths in module imports. This is infeasible when working with many dependencies in a project. This the only code transform this server does for you:

```javascript
import { html } from 'lit-html';
```
becomes:
```javascript
import { html } from '../../node_modules/lit-html/lit-html.js';
```
This will become obsolete over time, as a similar behavior is being standardized in browsers: https://github.com/WICG/import-maps

### Usage
```bash
npm i -D @open-wc/dev-server
```

#### Static files
By default the server will just serve up static files from your current working directory:
```
npx @open-wc/dev-server --open
```
You can open the server at a specific file:
```
npx @open-wc/dev-server --open src/my-file.html
```
To change the server's root directory:
```
npx @open-wc/dev-server --root-dir demo --open
```

#### Single Page App
For a SPA, you will want non-file requests to serve the app's index so that you can handle routing within your app. The browser will automatically open at your app's root path.
```bash
npx @open-wc/dev-server --app-index index.html --open
```

#### Component project
When working on a (web) component project, you will usually have a demo folder for local development:
```bash
npx @open-wc/dev-server --open demo/
```

If your demo itself is a SPA, you can also specify the app-index option:
```bash
npx @open-wc/dev-server --app-index demo/index.html --open
```

### Command line options
|name|alias|type|description|
|---|---|---|---|---|
|--port|-p|number|The port to use. Default: 8080|
|--hostname|-h|string|The hostname to use. Default: localhost|
|--open|-o|string/boolean|Opens the default browser on the given path or default /|
|--app-index|-a|string|The app's index.html file. When set, serves the index.html for non-file|
|--root-dir|-r|string|The root directory to serve files from. Defaults to the project root.|
|--modules-dir|-m|string|Directory to resolve modules from. Default: node_modules|
|--help|none|none|See all options|