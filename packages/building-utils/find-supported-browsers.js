const browserslist = require('browserslist');

const openWcTargets = [
  'last 2 Chrome major versions',
  'last 2 ChromeAndroid major versions',
  'last 2 Firefox major versions',
  'last 2 Edge major versions',
  // Last 2 edge no longer matches legacy EdgeHTML,
  // we should still support it for the time being
  'edge 18',
  'last 2 Safari major versions',
  'last 2 iOS major versions',
];

/**
 * Finds the supported browsers. Uses a user-defined configuration if defined,
 * otherwise uses a default set of supported browsers
 * @returns {string[]}
 */
module.exports = function findSupportedBrowsers() {
  // generate default list
  // @ts-ignore
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
      'Your browserslist configuration should not include ie 11.\n' +
        'The browserslists configuration is for the modern build.\n' +
        'Use the --legacy flag for a build for legacy browsers.\n',
    );
  }

  // use user defined targets, otherwise use our own defaults
  return userHasDefinedTargets ? userTargets : browserslist(openWcTargets);
};
