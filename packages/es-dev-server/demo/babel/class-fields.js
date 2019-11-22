import { html, render } from 'lit-html';

function defineClass() {
  return class MyClass {
    myField = '123';

    static myStaticField = '456';

    myArrowFunc = () => {
      console.log('hello world');
    };

    #privateField = 'class fields';

    #privateMethods() {
      return 'compile correct';
    }

    publicMethod() {
      return '' + this.#privateField + ' ' + this.#privateMethods();
    }
  }
}

render(
  html`
    <p>${new (defineClass())().publicMethod()} ✓</p>
  `,
  document.getElementById('class-fields'),
);

