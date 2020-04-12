const browserslist = require('browserslist');

const openWcTargets = [
  'last 3 Chrome major versions',
  'last 3 ChromeAndroid major versions',
  'last 3 Firefox major versions',
  'last 3 Edge major versions',
  'last 3 Safari major versions',
  'last 3 iOS major versions',
];

/**
 * Finds the supported browsers. Uses a user-defined configuration if defined,
 * otherwise uses a default set of supported browsers
 * @returns {string[]}
 */
function findModernBrowserslist() {
  // generate default list
  const browserslistDefaultTargets = browserslist(browserslist.defaults);
  // empty call causes browserslist to find a user-defined configuration
  // for example in .bowerslistrc or the package.json
  const userTargets = browserslist();

  // there is no way to know if browserslist found a user defined configuration, or if it
  // returns a default list. but we can check if the default list and the list returned from
  // an empty call are the same
  const userHasDefinedTargets =
    userTargets.length !== browserslistDefaultTargets.length ||
    userTargets.some(e => !browserslistDefaultTargets.includes(e));

  if (userHasDefinedTargets && userTargets.includes('ie 11')) {
    throw new Error(
      'Your browserslist configuration should not include IE 11.\n' +
        'You can configure rollup to output a separate build for IE 11',
    );
  }

  // use user defined targets, otherwise use our own defaults
  return userHasDefinedTargets ? userTargets : browserslist(openWcTargets);
}

module.exports = { findModernBrowserslist };
