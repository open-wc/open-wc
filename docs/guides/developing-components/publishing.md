# Developing Components >> Publishing ||60

Refer for [Application publishing](../../docs/building/rollup.md) guide as it is different from Component. 

When you are ready to publish your package to npm, be sure that you've addressed the recommendations below to ensure the code you publish is as easy for your users to consume as possible. Your package should already have [demos](/demoing/), [documentation](/demoing/storybook-addon-markdown-docs.html), [tests](/testing/), et al, as each of these plays a role in making the clearest example of the benefits on your work, outlining the easiest path to integrating that work into other projects, and ensuring that the package as a whole is resilient to change over time. With this reality in mind, they will not be discussed directly below. If you're looking for information on including these things in your published packages, take a look at our [guides](/guide/index.html) or learn about [getting started](#getting-started) below.

```js script
import '@d4kmor/launch/inline-notification/inline-notification.js';
```

<inline-notification type="warning">

These suggestions are not specifically useful for publishing to a CDN or any other context where broader application-specific optimisations may be appropriate.

</inline-notification>

### Do: 👍

- ✅ &nbsp;[Do publish latest standard EcmaScript](#do-publish-latest-standard-ecmascript)
- ✅ &nbsp;[Do publish standard es modules](#do-publish-standard-es-modules)
- ✅ &nbsp;[Do include `"main": "index.js"` and `"module": "index.js"` in your `package.json`](#do-include-main-indexjs-and-module-indexjs-in-your-packagejson)
- ✅ &nbsp;[Do export element classes](#do-export-element-classes)
- ✅ &nbsp;[Do export side effects separately](#do-export-side-effects-separately)
- ✅ &nbsp;[Do import 3rd party node modules with "bare" import specifiers](#do-import-3rd-party-node-modules-with-bare-import-specifiers)
- ✅ &nbsp;[Do include file extensions in import specifiers](#do-include-file-extensions-in-import-specifiers)
- _Optional_: [use `type: "module"` when possible](#optional-use-type-module)
- _Optional_: [include typings; e.g. `*.d.ts` files](#optional-include-typings)
- _Optional_: [include source maps](#optional-include-source-maps)

### Don't: 👎

- ❌ &nbsp;[Do not optimize](#do-not-optimize)
- ❌ &nbsp;[Do not bundle](#do-not-bundle)
- ❌ &nbsp;[Do not minify](#do-not-minify)
- ❌ &nbsp;[Do not use `.mjs` file extensions](#do-not-use-mjs-file-extensions)
- ❌ &nbsp;[Do not import polyfills](#do-not-import-polyfills)

### General concept: Building is an application-level concern

Your users will always have the most intimate knowledge of how and where their code will be delivered to their users. Give them the greatest amount of flexibility in preparing their code for those conditions by publishing your package with the agreement that building is an application-level concern. Any decision that you can make in support of your users having an easier time when and if they decide to bundle is a good decision to make when preparing your package for publication. Every "do" and every "don't" that is included herein will help you in doing just that.

### Do publish latest standard EcmaScript

Write standard EcmaScript from the start, and publishing standard EcmaScrip will come naturally. However, if you choose to write your component in TypeScript or with various emerging specifications or APIs, be sure to convert your code to standard EcmaScript before publication. If you use non-standard syntax; transpile that (and only that) down to a reasonably modern level (e.g. [TC39 Stage 4](https://github.com/tc39/proposals/blob/master/finished-proposals.md) and/or available cross-browser) to decrease the likelihood that verbose or duplicate code is included in any final production delivery of pages featuring your package.

### Do publish standard es modules

In agreement with the "do" above, es modules are both Stage 4, supported in all modern browsers and tool-chains, ensure your package is published as es modules.

### Do include `"main": "index.js"` and `"module": "index.js"` in your `package.json`

Your `package.json` should have both its `main` entry point and `module` entry point to the same es module file. The `module` entry point informs tooling (bundlers, CDNs, etc.) which file to load by default in a module environment and, because es modules are standard EcmaScript, your `main` entry point should point to the same file. You will find this already configured for you if you've started your project with `npm init @open-wc`, but ensure your `package.json` file includes something similar to the following:

```
{
  "main": "index.js",
  "module": "index.js",
  // ...
}
```

### Do export element classes

Every custom element is a class extension of `HTMLElement`; e.g. `class MyElement extends HTMLElement {}`. Be sure that you export this class from your package. When starting from `npm init @open-wc` you will see this export in `src/MyElement.js` and referenced by the `index.js` entry point. This will make it possible for both customization of your element via extension (e.g. `class NewElement extends MyElement {}`) as well as for advanced usage of the custom element in Scoped Registries, both [native](https://github.com/w3c/webcomponents/issues/716) (when available) or [synthetic](/scoped-elements/).

### Do export side effects separately

A [side effect](<https://en.wikipedia.org/wiki/Side_effect_(computer_science)>) in javascript is created when the script changes state outside of the scope in which it is run. This includes when code in an es module alters values available on the `window` or `document`. A side effect occurs when registering Custom Elements via `customElements.define()`. JS files with side effects should exist separately from your packages entry point. `npm init @open-wc` takes care of this for you by creating a separate `my-element.js` that manages the registration of your custom element.

If you do choose to publish code with side effects as part of your entry point, it should be placed in a separate function that has to explicitly be called by the consumer (e.g. `run()`, `init()`, etc.). This allows your users to determine when these effects are triggered.

### Do import 3rd party node modules with "bare" import specifiers

When referring to 3rd party dependencies in your code, you cannot guarantee that implementing projects rely on the same file structure as you do. To prevent dependency specifiers from causing issues across different environments, be sure to import these dependencies into your project with "bare" import specifiers so that tooling in your users' environment can manage resolving the location of those dependencies; e.g. `import { LitElement } from 'lit-element';`

### Do include file extensions in import specifiers

When importing something that doesn't point directly to the entry point of a module, e.g.: `import {LitElement} from 'lit-element';`, always make sure to include a file extension: `import { ifDefined } from 'lit-html/directives/if-defined.js';`

**Yes:** 👍

```js
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
```

**No:** 👎

```js
import { html } from 'lit-html.js';
import { ifDefined } from 'lit-html/directives/if-defined';
```

### Optional: use `type: "module"`

Using `type: "module"` in your `package.json` will help CDNs and bundlers choose whether to parse your package with a module parse goal. However, it will also enforce that all the code you execute needs to be es modules. This includes all the dev tools (like bundlers, linters, ...) you use as well. CommonJs may still be used but requires a special way of importing. Therefore if all of the JS in your package is es modules, and using this entry in your `package.json` does not cause issues with your tools or scripts, then using `type: "module"` will allow those CDNs or bundlers to better leverage your package. If tools or script in your package have issues running in Node@12+ due to this inclusion, excluding it will ease the local requirements on import statements in your code.

### Optional: include typings

`*.d.ts` files are an important bridge between your code and users that choose to develop in TypeScript. If you are already developing in TypeScript, then generating these is as simple as adding the appropriate property to your `tsconfig.json`. If you are developing in JS, it can still be useful to include typings; learn more about [generating type definitions from javascript](https://dev.to/open-wc/generating-typescript-definition-files-from-javascript-5bp2).

### Optional: include source maps

If you choose work in TypeScript, or to use syntax that is newer than the standards discussed above, it can be important to include source maps and the source files (TypeScript or otherwise) that your published code originates from to make understanding that code, as well as possibly reporting/fixing issues in that code, easier for your users.

### Do not optimize

Optimization is an application-level concern. It's not repeating yourself if it is a really important point, it's merely ensuring that it sinks in. Your package will be leveraged by a developer that will know more about their specific delivery targets than you will and you must not attempt to optimize your code beyond delivering the best possible standard EcmaScript that you can.

### Do not bundle

Bundling is an application-level concern. If you bundle, and then another dependency bundles and both dependencies bundle the same transitive dependencies it will become next to impossible for later tooling to deduplicate that code. Be sure NOT to bundle code in your published packages so that your users will have the easiest time possible optimizing their application for the specific use cases they target.

### Do not minify

Minification is an application-level concern. What's more, minifiers get better all the time, and you can ensure that your users can leverage the best in class approach to this space available by skipping the minifier when publishing your package.

### Do not use `.mjs` file-extensions

It is still all too common that a `.mjs` file gets served to a browser with an incorrect mime type and causes an application to fail unrecoverably. This happens when the used server does not have `.mjs` configured which could either be because it never became a default in the server software or an older stable version is used. Prevent this issue from ever arising by only publishing `.js` files. In cases where you are working with Node scripting in your package and you find issue with this recommendation, please see [Optional: use `type: "module"`](#optional-use-type-module) above as a possible alternative.

### Do not import polyfills

If you feel you need polyfills, for package demos or the like, feel free to add them as `devDependencies`, but NEVER import them into modules. As has been repeated many times above, only your users will fully understand the use cases they target in such a way to determine whether polyfills should be included in an application, don't force a decision in this area onto them.

#### Additional Reading

- [How to Public Web Component to npm by Justing Fagnani](https://justinfagnani.com/2019/11/01/how-to-publish-web-components-to-npm/)
- [npm-publish](https://docs.npmjs.com/cli/publish)
- [Contributing Packages to the npm Registry](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

# Getting started...

There are many things to take into account when publishing your work to be shared publicly, even beyond those listed above. Some start from the very beginning of your development effort; director/file naming & organization, documentation, features, tests, etc. Others can all to easily be seen as an afterthought: bundling, `package.json` entries, registry targets, transpiling, types, etc. All play an important role in making the long term use and maintenance of your work as smooth as possible for you and your consumers. Luckily, beginning your component or application with the `npm init @open-wc` command will get you stared down the path towards making great choices in each of these areas. [Get started today!](/init/)
