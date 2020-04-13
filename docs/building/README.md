# Building

Building is a necessary optimization when shipping apps to production. By using a build you reduce the total size and amount of files transferred to the end-user, and you ensure your code runs on all supported browsers.

We recommend doing most of the building only in projects which deploy the final result to production, such as apps or websites. This is where you can make the best decisions about supported browsers and optimizations.

## Build types

Depending on the type of project, we recommend different approaches to building.

### Building single page apps (SPA)

If you are building a single page application we recommend [rollup](https://rollupjs.org/guide/en/) to build your app.

Take a look at our dedicated [building-rollup](/building/building-rollup) page which explains how to set up rollup. We ship a default config that you can use to set up your project, or you can use it as inspiration for your custom config.

### Building reusable components and libraries

If you are building a reusable component or library we recommend publishing code that runs without modifications on the latest browsers. You should not bundle in any dependencies or polyfills, or build to a very old of javascript such as es5. This way consuming projects can decide which polyfills to load and javascript version to target based on browser support.

In practical terms, this means publishing standard es modules and standard javascript features implemented in modern browsers like Chrome, Safari, Firefox, and Edge. We recommend [buildless development](/developing/) so unless you are using very cutting edge features, you can actually just publish your source code as is. See [this blog post](https://justinfagnani.com/2019/11/01/how-to-publish-web-components-to-npm/) for a general guideline.

If you are using very new or non-standard features such as typescript, you will need to set up a lightweight build. For this we recommend tools such as [babel](https://babeljs.io/) with the [preset-env](https://babeljs.io/docs/en/babel-preset-env) plugin or the [typescript compiler](https://www.typescriptlang.org/). Make sure to set the target to modern browsers, and publish es modules.

### Building websites or multi page apps (MPA)

Single page apps are great for a snappy user experience when you have highly dynamic content, but a lot of content on the web does not fall into this category. It still makes sense to build websites or apps consisting of multiple pages. This also requires a different approach to your build system.

We are still in the process of investigating and documenting our recommendations for this. In the meantime both [building-rollup](/building/building-rollup) and [@open-wc/rollup-plugin-html](https://open-wc.org/building/rollup-plugin-html.html) have tips for these types of projects.

## Webpack

We recommend [rollup](https://rollupjs.org/guide/en/) as a build tool. It is designed specifically for standard es modules and it's very easy to use. But sometimes you are not in control of choosing the tools to use on a project, and you need to make things work with other tools. For webpack, we also have a [standard config](https://github.com/open-wc/open-wc/tree/master/packages/building-webpack) which can be used to build apps with web components.
