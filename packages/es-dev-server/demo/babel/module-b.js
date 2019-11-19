/* eslint-disable */
import { html, render } from 'lit-html';

export const foo = () => 'module b foo';

console.log('module b');
console.log('lit-html', html);

function defineClass() {
  return class MyClass {
    myField = '123';

    static myStaticField = '456';

    myArrowFunc = () => {
      console.log('hello world');
    };

    #privateField = 'private field';

    #privateMethods() {
      return 'private method';
    }

    publicMethod() {
      console.log(this.#privateField, this.#privateMethods());
    }
  }
}

render(
  html`Class fields compiled to: <pre>${defineClass.toString()}<pre>`,
  document.getElementById('app'),
);

console.log(new (defineClass())().publicMethod())
