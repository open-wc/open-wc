/* eslint-disable no-console */
import { resolveUserAgent, ResolvedUserAgent } from 'browserslist-useragent';
import browserslist from 'browserslist';
import * as caniuse from 'caniuse-api';
import { Context } from 'koa';
import { logDebug } from './utils';
import { isModernBrowser } from './is-modern-browser';

export interface UserAgentCompat {
  browserTarget: string | null;
  modern: boolean;
  supportsEsm: boolean;
}

/**
 * We compile to es modules when the browser supports module scripts, dynamic imports
 * and import.meta.url. Unfortunately, caniuse doesn't report import.meta.url. Chrome 63
 * is the only browser which suppors dynamic imports but not import.meta.url.
 */
const moduleFeatures = ['es6-module', 'es6-module-dynamic-import'];

// Cache resolved user agents because we're going to request them a lot
const cache = new Map<string, UserAgentCompat>();

// Some browsers are resolved to a name unknown to browserslist
const browserAliases: Record<string, string> = {
  'UC Browser': 'UCAndroid',
};

/**
 * The user agent parser does not always return a valid version for samsung,
 * so we need to normalize it.
 */
function normalizeSamsungVersion(browser: string, version: string[]) {
  try {
    browserslist(`${browser} ${version}`);
    // browserslist didn't throw, return the valid version
    return version;
  } catch (error) {
    // we gave an invalid version to browserslist, so we try to
    // find the nearest matching major version for samsung browser
    const validVersions = [
      ...Object.keys((browserslist as any).versionAliases.samsung),
      ...(browserslist as any).data.samsung.versions,
    ];

    return validVersions.find(validVersion => validVersion[0] === version[0]);
  }
}

/**
 * The user agent parser returns patch versions, which browserslist doesn't
 * know about. Mostly the major version is sufficient, except for safari.
 */
function getBrowserVersion(resolvedUA: ResolvedUserAgent) {
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

function getBrowserName(browserName: string) {
  return browserAliases[browserName] || browserName;
}

/**
 * Returns whether this browser supports es modules. We count this when the browser
 * supports module syntax, scripts, dynamic imports. We can't feature detect
 * import.meta.url but any browsers which supports dynamic import supports import.meta.url,
 * except for chrome 63.
 */
function getSupportsEsm(browserTarget: string) {
  if (browserTarget.toLowerCase() === 'chrome 63') {
    return false;
  }
  return moduleFeatures.every(ft => caniuse.isSupported(ft, browserTarget));
}

/**
 * Calculates the user agent's compatibility.
 */
function calcUserAgentCompat(userAgent: string): UserAgentCompat {
  let resolvedUA;
  try {
    resolvedUA = resolveUserAgent(userAgent);
    const browserTarget = `${getBrowserName(resolvedUA.family)} ${getBrowserVersion(resolvedUA)}`;
    const modern = isModernBrowser(userAgent);
    const supportsEsm = modern ? true : getSupportsEsm(browserTarget);

    return { browserTarget, modern, supportsEsm };
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

export function getUserAgentCompat(ctx: Context): UserAgentCompat {
  const userAgent = ctx.get('user-agent');
  let compat = cache.get(userAgent);

  if (!compat) {
    compat = calcUserAgentCompat(userAgent);
    cache.set(userAgent, compat);
    logDebug(`User agent: ${userAgent} detected as compatibility:`, JSON.stringify(compat));
  }

  return compat;
}
