# Developing Components >> Getting Started ||10

To get started building web components, we recommend using our generator to set up your project.

## Generator

### Node.js

To use our generator, you first need to make sure you have Node.js installed. Go to the [official website](https://nodejs.org/) for installation instructions.

The minimum required versions are Node.js v10 and NPM v6.

### Running the generator

To run the generator, execute this command in the terminal:

```
npm init @open-wc
```

This will prompt you with questions about the type of project to scaffold.

We recommend starting with a web component project. Afterward, you pick the project features you'd like the generator to scaffold. We recommend choosing at least the testing option, and as well as the option to scaffold example files.

## Going buildless

Browsers have improved a lot over the past years. It's now possible to do web development without requiring complex build tooling, using the native module loader of the browser. We think this is a great fit for web components, and we recommend this as a general starting point.

Build tools can quickly add a lot of complexity to your code, and make your code reliant on a specific build setup. We think it's best to avoid them during development, or only add them for light transformations if you know what you're doing.

## Modern Web

We follow many of the development practices defined by [Modern Web](http://modern-web.dev/), our sister project. We recommend taking a look at their guides and documentation as well.

## Base libraries

Our generator sets you up with a component built with [lit-html](http://lit-html.polymer-project.org/) and [lit-element](https://lit-element.polymer-project.org/) as base libraries. We recommend this as a general starting point. `lit-html` and `lit-element` have a strong community, making it easy to find help and examples. It is actively maintained and creates a good balance between performance, developer experience and feature richness.

Other base libraries excel at other points and could be a great fit for for your project as well. Check the [base libraries](../community/base-libraries.md) page for alternative options.
