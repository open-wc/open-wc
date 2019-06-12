/* eslint-disable */
// @ts-nocheck
const myFunction = function myFunction() {
  if (true) {
    console.log('polyfill a: this code should be minified');
  }
  return 5;
};

console.log(myFunction());
