/* eslint-disable no-param-reassign */
const picoMatch = require('picomatch');
const { isAbsolute, posix, sep } = require('path');

/** @typedef {(path: string) => boolean} Matcher */
/** @typedef {import('./hmrPlugin').WcHmrPluginConfig} WcHmrPluginConfig */

/**
 * @param {string} msg
 */
function createError(msg) {
  return new Error(`[@open-wc/dev-server-hmr] ${msg}`);
}

/**
 * @param {WcHmrPluginConfig} config
 * @param {keyof WcHmrPluginConfig} prop
 */
function assertOptionalArray(config, prop) {
  if (config[prop] != null && !Array.isArray(config[prop])) {
    throw createError(`Option ${prop} must be an array`);
  }
}

/**
 * @param {WcHmrPluginConfig} config
 */
function parseConfig(config) {
  if (!Array.isArray(config.include) && !Array.isArray(config.exclude)) {
    throw createError('Must provide either an "include" or "exclude" pattern in config.');
  }
  assertOptionalArray(config, 'include');
  assertOptionalArray(config, 'exclude');
  assertOptionalArray(config, 'patches');
  assertOptionalArray(config, 'baseClasses');
  assertOptionalArray(config, 'decorators');
  assertOptionalArray(config, 'functions');
  assertOptionalArray(config, 'presets');

  config.baseClasses = config.baseClasses || [];
  config.baseClasses.push({ name: 'HTMLElement' });

  if (config.presets) {
    for (const preset of config.presets) {
      if (preset.patch) {
        config.patches = config.patches || [];
        config.patches.push(preset.patch);
      }
      if (preset.baseClasses) {
        config.baseClasses.push(...preset.baseClasses);
      }
      if (preset.decorators) {
        config.decorators = config.decorators || [];
        config.decorators.push(...preset.decorators);
      }
    }
  }

  return { ...config };
}

/**
 * @param {string} rootDir
 * @param {string} pattern
 * @returns {Matcher}
 */
function createMatcher(rootDir, pattern) {
  const matcherRootDir = rootDir.split(sep).join('/');
  const resolvedPattern =
    !isAbsolute(pattern) && !pattern.startsWith('*')
      ? posix.join(matcherRootDir, pattern)
      : pattern;
  return picoMatch(resolvedPattern);
}

/**
 * @param {string} rootDir
 * @param {string[]} patterns
 * @returns {Matcher}
 */
function createMatchers(rootDir, patterns) {
  const matchers = patterns.map(p => createMatcher(rootDir, p));
  return function matcher(path) {
    return matchers.some(m => m(path));
  };
}

module.exports = { createMatcher, createMatchers, parseConfig, createError };
