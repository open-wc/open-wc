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
