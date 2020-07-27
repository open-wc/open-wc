/* eslint-disable import/no-extraneous-dependencies */
const mock = require('mock-require');

mock('ts-node', () => {
  throw new Error("I don't want to run tests with ts-node");
});

require('karma/lib/cli').run();
