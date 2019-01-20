# Generator Open WC

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

## Usage

This generator is based on [yeoman](http://yeoman.io/). You can use it as demonstrated:

```bash
npm i -g yeoman
npm i -g generator-open-wc

yo open-wc:{generator-name}
```

or

```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:{generator-name}'
```


## Scaffold generators

These generators help you kickstart a web component.
You can use these in an empty folder to set up everything you need to get started immediately.

Example usage:
```bash
mkdir foo-bar
cd foo-bar
yo open-wc:scaffold-vanilla
# this will scaffold a new web component + run all available scaffold generators
```

### Available scaffold generators:

- `yo open-wc:scaffold-vanilla`<br/> 
  This generator scaffolds a new web component project for you with all of our recommendations. We recommend using this generator at the start of your web component project. 
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - open-wc:linting
      - open-wc:scaffold-testing
      - open-wc:scaffold-demoing
      - open-wc:automating
  </details>
  <br/>

- `yo open-wc:scaffold-demoing`<br/> 
  This generator scaffolds a Storybook setup for you with examples to your existing project. 
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - open-wc:demoing
      - Plus Storybook examples
  </details>
  <br/>

- `yo open-wc:scaffold-testing`<br/>
  This generator scaffolds a Karma setup for you with examples to your existing project. 
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - open-wc:testing
      - Plus example tests
  </details>
  <br/>


## Upgrade generators
These generators help you to align your current project with the `open-wc` recommendations.
You can use these to add to an existing project that already contains code for your web component.

Example usage:
```bash
cd existing-web-component
yo open-wc
# this will execute all available upgrade generators
```

### Available upgrade generators

- `yo open-wc:linting`<br> 
This generator adds a complete linting setup with ESLint, Prettier, Husky and commitlint to your existing project. 
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - open-wc:linting-eslint
      - open-wc:linting-prettier
      - open-wc:linting-commitlint
  </details>
  <br/>
  

- `yo open-wc:testing`<br>
This generator adds a complete testing setup with Karma, and Karma Browserstack to your existing project. 
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - open-wc:testing-karma
      - open-wc:testing-karma-bs
  </details>
  <br/>
      

- `yo open-wc:demoing`<br>
This generator adds a complete demoing setup with Storybook to your existing project.
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - open-wc:demoing-storybook
  </details>
  <br/>


- `yo open-wc:automating`<br>
This generator adds a complete automating setup with CircleCi to your existing project. 
  <details>
    <summary>More info</summary>
    <br/>
    This generator will internally run:

      - open-wc:automating-circleci
  </details>
  <br/>


### Optional upgrade generators
These generators are not executed with the default upgrade generator.

- `yo open-wc:testing-wallaby`<br>
  This will set up [Wallaby](https://wallabyjs.com/) to enable testing directly in your IDE. For more information, see [testing-wallaby](/testing/testing-wallaby.html).

### Sub generators
These generators are executed with the default upgrade generator.
You can use these generators if you already have an existing project that you would like to add to.

- `yo open-wc:linting-eslint`<br>
  This generator adds linting with ESLint to your existing project.


- `yo open-wc:linting-prettier`<br>
  This generator adds code formatting with Prettier to your existing project.


- `yo open-wc:linting-commitlint`<br>
  This generator adds linting to your git commits with commitlint to your existing project.


- `yo open-wc:testing-karma`<br>
  This generator adds a testing setup with Karma to your existing project.


- `yo open-wc:testing-karma-bs`<br>
  This generator adds a testing setup with Karma and Browserstack to your existing project. This generator requires a manual step of adding your Browserstack credentials to your `.bashrc`. For more information, see [this page](/testing/testing-karma-bs.html#setup).


- `yo open-wc:automating-circleci`<br>
  This generator adds continuous integration with CircleCi to your existing project.

