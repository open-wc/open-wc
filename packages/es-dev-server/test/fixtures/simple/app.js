import { message } from 'my-module';
import './src/local-module.js';

console.log(`The message is: ${message}`);

// class is compiled by legacy build
class Foo {

}

// class is compiled by legacy build
const bar = 'buz';

async function* asyncGenerator() {
  await Promise.resolve();
  yield 0;
  await Promise.resolve();
  yield 1;
}
