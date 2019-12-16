import { html, render } from 'lit-html';

// object rest/spread
const foo = { a: 1 };
const bar = { ...foo };
console.log(bar);

// async function
async function asyncFunction() {
  console.log('async function');
}
asyncFunction();

// exponentiation
console.log(2 ** 4);

// classes
class Foo {
  constructor() {
    console.log('foo class');
    this.foo = 'bar';
  }
}

// template literal
const templateLiteral = `template ${'literal'}`;

window.__stage4 = new Foo().foo === 'bar' && templateLiteral === 'template literal' && bar.a === 1 && asyncFunction() instanceof Promise;