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
  }
}
new Foo();

// template literal
console.log(`template ${'literal'}`);

render(
  html`
    <p>Stage 4 features don't throw any syntax errors ✓</p>
  `,
  document.getElementById('stage-4'),
);
