# Create Open Web Components

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Usage

```bash
# in a new or existing folder:
npm init @open-wc
# requires node 10 & npm 6 or higher
```

This will kickstart a menu guiding you through all available actions.
```
$ npm init @open-wc
npx: installed 14 in 4.074s
What would you like to do today?
  > Scaffold a new project
    Upgrade an existing project
    Nah, I am fine thanks! => exit
```

## Scaffold generators

These generators help you kickstart a new app or web component.
They will create a new folder and set up everything you need to get started immediately.

Example usage:
```bash
npm init @open-wc starter-app
```

### Available scaffold generators:

- `starter-app`<br/>
  This generator scaffolds a new starter application. We recommend using this generator at the start of your web component project.
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - npm init @open-wc bundling-webpack
      - npm init @open-wc testing
      - npm init @open-wc linting
      - A frontend setup
  </details>
  <br/>

- `barebones-app`<br/>
  This generator scaffolds a very minimal starter application. We recommend using this generator if you want a minimal overhead, and get developing quickly.
  <br/>

- `wc-lit-element`<br/>
  This generator scaffolds a new web component project with LitElement for you. We recommend using this generator at the start of your web component project.
  <br/>


## Upgrade generators
These generators help you to align your current project with the `open-wc` recommendations.
You can use these to add to an existing project that already contains code for your web component.

Example usage:
```bash
cd existing-web-component
npm init @open-wc linting
```

### Available upgrade generators

- `linting`<br>
This generator adds a complete linting setup with ESLint, Prettier, Husky and commitlint to your existing project.
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - npm init @open-wc linting-eslint
      - npm init @open-wc linting-prettier
      - npm init @open-wc linting-commitlint
  </details>
  <br/>


- `building`<br>
This generator adds a complete building setup with webpack to your existing project.
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - npm init @open-wc building-webpack
  </details>
  <br/>


- `testing`<br>
This generator adds a complete testing setup with Karma, and Karma Browserstack to your existing project.
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - npm init @open-wc testing-karma
      - npm init @open-wc testing-karma-bs
  </details>
  <br/>


- `demoing`<br>
This generator adds a complete demoing setup with Storybook to your existing project.
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - npm init @open-wc demoing-storybook
  </details>
  <br/>


- `automating`<br>
This generator adds a complete automating setup with CircleCi to your existing project.
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - npm init @open-wc automating-circleci
  </details>
  <br/>


### Optional upgrade generators
These generators are not executed with the default upgrade generator.

- `testing-wallaby`<br>
  This will set up [Wallaby](https://wallabyjs.com/) to enable testing directly in your IDE. For more information, see [testing-wallaby](/testing/testing-wallaby.html).

### Sub generators
These generators are executed with the default upgrade generator.
You can use these generators if you already have an existing project that you would like to add to.

- `building-webpack`<br>
  This generator adds a build configuration with Webpack to your existing project.

- `linting-eslint`<br>
  This generator adds linting with ESLint to your existing project.


- `linting-prettier`<br>
  This generator adds code formatting with Prettier to your existing project.


- `linting-commitlint`<br>
  This generator adds linting to your git commits with commitlint to your existing project.


- `testing-karma`<br>
  This generator adds a testing setup with Karma to your existing project.


- `testing-karma-bs`<br>
  This generator adds a testing setup with Karma and Browserstack to your existing project. This generator requires a manual step of adding your Browserstack credentials to your `.bashrc`. For more information, see [this page](/testing/testing-karma-bs.html#setup).


- `automating-circleci`<br>
  This generator adds continuous integration with CircleCi to your existing project.

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/create/src/README.md';
      }
    }
  }
</script>