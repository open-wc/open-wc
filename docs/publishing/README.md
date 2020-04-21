# Publishing

There are many things to take into account when publishing your work to be shared publicly. Some start from the very beginning of your development effort; director/file naming & organization, documentation, features, tests, etc. Others can all to easily be seen as an after thought: bundling, `package.json` entries, registry targets, transpiling, types, etc. All play an important role in making the long term use and maintanence of your work as smooth as possible for you and your consumers. Luckily, beginning your component or application with the `npm init @open-wc` command will get you stared down the path towards making great choices in each of these areas.

## Publishing a Component

### package.json

#### Make sure you dependancies are `dependancies`, so everyone gets them.

#### `type`, `main`, `module`, `types`...

### Why `index.js`, `component-name.js` and `src/ComponentName.js`?

- side effect free default imports for smaller app bundles
- opt-in centralized custom element definitions for the majority of use cases
- easy to leverage base class exports for relying on Scopped Elements, or the in development Custom Elements Registries specification

### Pick a transpilation target

- ES2017 is broadly supported: https://kangax.github.io/compat-table/es2016plus/
- ES2018 hits some bumps in Firefox around `RegExp`, but 2019 and 2020 also have pretty good support across evergreen browsers
- the less you transpile, the more your consumers can make the decision of what transpilation they require in their application context for themselves
- if you use something fancy, and don't transpile it, document it!

### Additional Reading

- [How to Public Web Componoent to NPM by Justing Fagnani](https://justinfagnani.com/2019/11/01/how-to-publish-web-components-to-npm/)
