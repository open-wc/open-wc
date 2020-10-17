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

Browsers have improved a lot over the past years. It's now possible to do web development without requiring any build tools, using the native module loader of the browser. We think this is a great fit for web components, and we recommend this as a general starting point.

Build tools can quickly add a lot of complexity to your code, and make your code reliant on a specific build setup. We think it's best to avoid them during development, or only add them for light transformations if you know what you're doing.
