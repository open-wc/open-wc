// object rest/spread
const foo = { a: 1 };
export const bar = { ...foo };

// async function
export async function asyncFunction() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return 'async function';
}

// exponentiation
export function power(a, b) {
  return a ** b;
}

// classes
export class Foo {
  constructor() {
    this.bar = 'foo';
  }
}

export function messageTemplate(message) {
  return `message: ${message}`;
}
