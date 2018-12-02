/* eslint-disable */
// Imports all test files for webpack to generate one single test bundle
const testsContext = require.context(__WEBPACK_INJECTED_TEST_DIR__, true, __WEBPACK_INJECTED_TEST_FILE_PATTERN__);
testsContext.keys().forEach(testsContext)