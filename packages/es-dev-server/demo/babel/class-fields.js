import { html } from 'lit-html';

function defineClass() {
  return class MyClass {
    myField = '123';

    static myStaticField = 'class fields';

    myArrowFunc = () => {
      console.log('hello world');
    };

    #privateField = 'compile';

    #privateMethods() {
      return 'correctly';
    }

    publicMethod() {
      return '' + this.constructor.myStaticField + ' ' + this.#privateField + ' ' + this.#privateMethods();
    }
  }
}

window.__classFields = new (defineClass())().publicMethod() === 'class fields compile correctly';
