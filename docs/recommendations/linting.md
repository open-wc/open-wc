# Linting

The goal of linting is to

## ESLint

Uses [ESLint](https://eslint.org/) to lint your es6 code.

Setup
```sh
npx -p yo -p generator-open-wc -c 'yo open-wc:lint-eslint'
```

::: tip Info
This is part of the default recommendations
:::

### What you get

This will install `@open-wc/eslint-config`. A config based on airbnb but allow for specialities needed for web components like.
- apply linting to js and html files
- allow dynamic module imports
- allow imports in test/demos from devDependencies
- allow underscore dangle
- do not prefer default exports
- do not prefer no file extension

### Run
```sh
npm run lint:eslint
```

## commitlint

Uses [commitlint](http://marionebl.github.io/commitlint) to ensure proper commit messages.

Setup
```sh
# tbd
```

### What you get

tbd

### Run
```sh
#tbd
```
