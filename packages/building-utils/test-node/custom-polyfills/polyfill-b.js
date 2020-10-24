// @ts-nocheck
/* eslint-disable */
const myFunction = function myFunction() {
  if (true) {
    console.log('polyfill b: this code should not be minified');
  }
  return 5;
};

console.log(myFunction());
