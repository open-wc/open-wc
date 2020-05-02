---
permalink: 'developing/types.html'
title: Types
section: guides
tags:
  - guides
---

# Types

## Types are good

> The following information is a quote from [Type Safe JavaScript with JSDoc](https://medium.com/@trukrs/type-safe-javascript-with-jsdoc-7a2a63209b76)

Types provide valuable information about the nature of code, and help identify typos, enable refactoring, etc. Most editors these days provide some kind of IntelliSense based on type information gleaned from the code. My favorite is Visual Studio Code. With proper type information it can give you symbol defintions on hover, code completion, symbol renaming across files, etc.

### Benefits of Types

1. Early detection of type errors
2. Better code analysis
3. Improved IDE support
4. Promotes dependable refactoring
5. Improves code readability
6. Provides useful IntelliSense while coding
7. These benefits are provided by using TypeScript, Flow and even JSDoc comments.

## Open Web Components Types

For most of our products we do offer types via JSDocs.
In order to utilize types, you will need to set them up for your project.

### Why types?

Types can help improve your developer experience by giving you:

- Awesome intellisense for @open-wc tools/helpers
- Ability to jump directly to the source of @open-wc code via F12 (in vs code)

Here is a small gif showing how it can help.

![TypesExample](/types.gif)

### Setup for JavaScript

In order to get type linting in a JavaScript project using VS Code all you need is to add a `tsconfig.json`.

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "lib": ["es2017", "dom"],
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "strict": false,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true
  },
  "include": ["**/*.js", "node_modules/@open-wc/**/*.js"],
  "exclude": ["node_modules/!(@open-wc)"]
}
```

### Setup for TypeScript

If you wish to use our typings in TypeScript you will need to do a little more.

You will need to add to this to your `tsconfig.json`.

```json
{
  "compilerOptions": {
    "allowJs": true
  },
  "include": ["node_modules/@open-wc/**/*.js"],
  "exclude": ["node_modules/!(@open-wc)"]
}
```

e.g. we need to include the js files from @open-wc and you can not have it in an exclude.

However as `allowJs` prevents you from generating definition files for your own typescript files ([issue 7546](https://github.com/Microsoft/TypeScript/issues/7546)) you probably want to have an alternative config `tsconfig.build.json` for that.

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "allowJs": false,
    "checkJs": false
  }
}
```

You can then use it like so in you `package.json`

```json
{
  "scripts": {
    "lint:types": "tsc",
    "build": "tsc -p tsconfig.build.json"
  }
}
```

That way

- `tsconfig.json` will be used by the language server (in VS code)
- `tsconfig.build.json` will be used to build your typescript project (including definition files)

Example how a full config might look like

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "lib": ["es2017", "dom"],
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "strict": false,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true
  },
  "include": ["**/*.js", "node_modules/@open-wc/**/*.js"],
  "exclude": ["node_modules/!(@open-wc)"]
}
```
