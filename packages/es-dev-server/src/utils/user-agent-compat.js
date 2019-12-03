/* eslint-disable no-console */
import { resolveUserAgent, matchesUA } from 'browserslist-useragent';
import * as browserslist from 'browserslist';
import * as caniuse from 'caniuse-api';
import { logDebug } from './utils.js';

/**
 * @typedef {object} UserAgentCompat
 * @property {string} browserTarget the browser name and version, usable for targeted compilation
 * @property {boolean} modern whether this is a modern browser: the latest 2 of the major browsers
 * @property {boolean} supportsEsm whether this browsers supports es modules
 */

/**
 * We compile to es modules when the browser supports module scripts, dynamic imports
 * and import.meta.url. Unfortunately, caniuse doesn't report import.meta.url. Chrome 63
 * is the only browser which suppors dynamic imports but not import.meta.url.
 */
const moduleFeatures = ['es6-module', 'es6-module-dynamic-import'];

// Cache resolved user agents because we're going to request them a lot
/** @type {Map<string, UserAgentCompat>} */
const cache = new Map();

// Some browsers are resolved to a name unknown to browserslist
const browserAliases = {
  'UC Browser': 'UCAndroid',
};

/**
 * The user agent parser does not always return a valid version for samsung,
 * so we need to normalize it.
 */
function normalizeSamsungVersion(browser, version) {
  try {
    browserslist(`${browser} ${version}`);
    // browserslist didn't throw, return the valid version
    return version;
  } catch (error) {
    // we gave an invalid version to browserslist, so we try to
    // find the nearest matching major version for samsung browser
    const validVersions = [
      ...Object.keys(browserslist.versionAliases.samsung),
      ...browserslist.data.samsung.versions,
    ];

    return validVersions.find(validVersion => validVersion[0] === version[0]);
  }
}

/**
 * The user agent parser returns patch versions, which browserslist doesn't
 * know about. Mostly the major version is sufficient, except for safari.
 * @param {*} resolvedUA
 */
function getBrowserVersion(resolvedUA) {
  const version = resolvedUA.version.split('.');
  switch (resolvedUA.family) {
    case 'Safari':
    case 'iOS':
      return `${version[0]}.${version[1]}`;
    case 'Samsung':
      return normalizeSamsungVersion(resolvedUA.family, version);
    default:
      return version[0];
  }
}

function getBrowserName(browserName) {
  return browserAliases[browserName] || browserName;
}

/**
 * Returns whether this browser supports es modules. We count this when the browser
 * supports module syntax, scripts, dynamic imports. We can't feature detect
 * import.meta.url but any browsers which supports dynamic import supports import.meta.url,
 * except for chrome 63.
 * @param {string} browserTarget
 */
function getSupportsEsm(browserTarget) {
  if (browserTarget.toLowerCase() === 'chrome 63') {
    return false;
  }
  return moduleFeatures.every(ft => caniuse.isSupported(ft, browserTarget));
}

/**
 * Calculates the user agent's compatibility.
 * @param {string} userAgent
 */
function calcUserAgentCompat(userAgent) {
  let resolvedUA;
  try {
    resolvedUA = resolveUserAgent(userAgent);
    const browserTarget = `${getBrowserName(resolvedUA.family)} ${getBrowserVersion(resolvedUA)}`;
    const supportsEsm = getSupportsEsm(browserTarget);

    const modern = matchesUA(userAgent, {
      browsers: [
        'last 2 Chrome major versions',
        'unreleased Chrome versions',
        'last 2 ChromeAndroid major versions',
        'unreleased ChromeAndroid versions',
        'last 2 Opera major versions',
        'unreleased Opera versions',
        'last 2 Firefox major versions',
        'unreleased Firefox versions',
        'last 2 FirefoxAndroid major versions',
        'unreleased FirefoxAndroid versions',
        // // safari versions progress more slowly
        'last 1 Safari versions',
        'last 1 iOS versions',
        // unreleased safari throws an error?
        // 'unreleased Safari versions',
      ],
      allowHigherVersions: true,
    });

    return {
      browserTarget,
      modern,
      supportsEsm,
    };
  } catch (error) {
    let message = '\n';
    if (!resolvedUA) {
      message = `Unable to resolve user agent: ${userAgent}.`;
    } else {
      message = `Resolved to invalid user agent: ${JSON.stringify(resolvedUA)}.`;
    }
    console.warn(
      `${message} Using max compatibility mode. Try updating your dependencies, ` +
        'or file an issue with a reproduction.\n',
    );
    return {
      browserTarget: null,
      modern: false,
      supportsEsm: false,
    };
  }
}

/**
 * @param {import('koa').Context} ctx
 * @returns {UserAgentCompat}
 */
export function getUserAgentCompat(ctx) {
  const userAgent = ctx.get('user-agent');
  let compat = cache.get(userAgent);

  if (!compat) {
    compat = calcUserAgentCompat(userAgent);
    cache.set(userAgent, compat);
    logDebug(`User agent: ${userAgent} detected as compatibility:`, compat);
  }

  return compat;
}
