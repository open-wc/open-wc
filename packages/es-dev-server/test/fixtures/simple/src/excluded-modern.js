import { message } from 'my-module';

async function* asyncGenerator() {
  await Promise.resolve();
  yield 0;
  await Promise.resolve();
  yield 1;
}
