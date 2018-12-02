// Imports all test files for webpack to generate one single test bundle.
// First parameter is the test folder, third paramter is a regexp to match the file against
const testsContext = require.context('./test', true, /.test$/);
testsContext.keys().forEach(testsContext);
