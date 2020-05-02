---
permalink: 'faq/unit-testing-init-error.html'
title: Testing for errors thrown in initialization
section: faq
tags:
  - faq
---

# Testing for errors thrown in initialization

## The issue - components silently failing

Suppose you have a component that requires certain properties to work in a certain way.
You can handle this like classic built-in DOM elements by silently failing, or you can throw an exception that tells the user what exactly went wrong. We recommend you help the consumer of your web component by throwing an exception rather than silently failing.

## Setting up your component for testing

The problem is that the error of web components is thrown in a different "context" and can be not caught in a test.

The first thing you can do is have a special method that takes care of checking if the property exists, and throw if that check fails:

```js
class StringField extends ... {

  checkProperties(){
    if (!this.definition) {
      throw new Error('property "definition" required');
    }
  }
}
```

This method should be called before the first render when the element gets attached to the DOM in [connectedCallback](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks) or [update](https://lit-element.polymer-project.org/guide/lifecycle#update) when using [LitElement](https://lit-element.polymer-project.org/).

## The test case

```js
it('should throw when missing definition property', async () => {
  const el = new StringField();
  expect(() => el.checkProperties()).to.throw('property "definition" required');
});
```

You might also want to check that `checkProperties` actually gets get called when the component is rendered.

```js
it('checkProperties gets called', async () => {
  let checkCalled = false;
  const tag = defineCE(
    class extends StringField {
      checkProperties() {
        checkCalled = true;
      }
    },
  );
  await fixture(`<${tag}></${tag}>`);
  expect(checkCalled).to.be.true;
});
```
