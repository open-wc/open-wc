import { matchesUA } from 'browserslist-useragent';
import { logDebug } from './utils';

/**
 * We skip babel compilation for the latest versions of the major browsers.
 *
 * Chrome, Edge and Firefox: releases frequently so we take the latest 2
 *
 * Safari/iOS Safari: releases infrequently so we take the latest 1
 *
 * Chromium based browsers like Brave, Yandex and Opera: unsure how
 *   often they release, so not what strategy to pick. Ideally we have a
 *   way to map from browser version to chromium version.
 */
const modernBrowsers = [
  'last 2 Chrome major versions',
  'unreleased Chrome versions',

  'last 2 ChromeAndroid major versions',
  'unreleased ChromeAndroid versions',

  'last 2 Edge major versions',
  'unreleased Edge versions',

  'last 2 Firefox major versions',
  'unreleased Firefox versions',

  'last 2 FirefoxAndroid major versions',
  'unreleased FirefoxAndroid versions',

  'last 1 Safari versions',
  'last 1 iOS versions',
  // unreleased safari throws an error
  // 'unreleased Safari versions',
];

/**
 * Usually browsers implement new features before they become browser standards.
 * Sometimes not all browsrs have implemented them before they become a standard.
 *
 * If these are features with a significant developer or end-user benefit, we make
 * exceptions for certain browser versions to lose the speed benefit.
 *
 * Unimplemented features currently being tracked:
 * - Optional chaining
 * - Nullish coalescing
 *
 * This list should be curated, when the latest 1 or 2 of the major browsers have
 * implemented these features, we can clear the override list.
 */
const unimplementedFeatures = [
  // <= does properly match, so we list the latest 2 versions which doesn't support it,
  // the rest will be filtered by the other check
  'Chrome 78',
  'Chrome 79',

  'ChromeAndroid 78',
  'ChromeAndroid 79',

  // (edge 78 does not exist)
  'Edge 79',

  'Firefox 72',
  'Firefox 73',

  'FirefoxAndroid 72',
  'FirefoxAndroid 73',

  'Safari 12',
  'Safari 12.1',
  'Safari 13',
  'iOS 12',
  'iOS 12.1',
  'iOS 13',
];

export function isModernBrowser(userAgent: string) {
  if (matchesUA(userAgent, { browsers: unimplementedFeatures })) {
    logDebug(
      `Forcing compatibility mode on user agent ${userAgent} because it does not` +
        ' implement all standard stage 4 features.',
    );
    return false;
  }

  return matchesUA(userAgent, {
    browsers: modernBrowsers,
    allowHigherVersions: true,
  });
}
