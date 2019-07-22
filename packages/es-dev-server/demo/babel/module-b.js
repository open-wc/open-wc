/* eslint-disable */
import { html, render } from 'lit-html';

export const foo = () => 'module b foo';

console.log('module b');
console.log('lit-html', html);

function defineClass() {
  class MyClass {
    myField = '123';

    static myStaticField = '456';

    myArrowFunc = () => {
      console.log('hello world');
    };
  }
}

render(
  html`Class fields compiled to: <pre>${defineClass.toString()}<pre>`,
  document.getElementById('app'),
);
