import minimatch from 'minimatch';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import {
  createCompatibilityBabelTransform,
  createMinCompatibilityBabelTransform,
  createMaxCompatibilityBabelTransform,
  polyfillModulesTransform,
  createBabelTransform,
} from './babel-transform.js';
import { resolveModuleImports } from './resolve-module-imports.js';
import { compatibilityModes } from '../constants.js';

/** @typedef {import('./babel-transform.js').BabelTransform} BabelTransform */

/**
 * @typedef {object} CompatibilityTransformConfig
 * @property {string} rootDir
 * @property {string[]} moduleDirectories
 * @property {boolean} readUserBabelConfig
 * @property {boolean} nodeResolve
 * @property {string} compatibilityMode
 * @property {object} [customBabelConfig]
 * @property {string[]} extraFileExtensions
 * @property {string[]} babelExclude
 * @property {string[]} babelModernExclude
 * @property {boolean} preserveSymlinks
 */

/**
 * @typedef {object} FileData
 * @property {import('./user-agent-compat.js').UserAgentCompat} uaCompat
 * @property {string} filePath
 * @property {string} code
 */

/**
 * @param {CompatibilityTransformConfig} cfg
 */
export function createCompatibilityTransform(cfg) {
  const fileExtensions = [...DEFAULT_EXTENSIONS, ...cfg.extraFileExtensions];
  /** @type {Map<string, BabelTransform>} */
  const babelTransforms = new Map();
  const minCompatibilityTransform = createMinCompatibilityBabelTransform(cfg);
  const maxCompatibilityTransform = createMaxCompatibilityBabelTransform(cfg);

  /**
   * Gets the babel compatibility transform for the given user agent. Caches
   * babel previously created configs.
   * @param {FileData} file
   */
  function getAutoCompatibilityBabelTranform(file) {
    const { browserTarget } = file.uaCompat;
    const cachedTransform = babelTransforms.get(browserTarget);
    if (cachedTransform) {
      return cachedTransform;
    }

    const babelTransform = createCompatibilityBabelTransform({
      browserTarget,
      readUserBabelConfig: cfg.readUserBabelConfig,
      customBabelConfig: cfg.customBabelConfig,
    });
    babelTransforms.set(browserTarget, babelTransform);
    return babelTransform;
  }

  /**
   * Gets the compatibility transform function based on the compatibility
   * mode.
   * @param {FileData} file
   */
  function getCompatibilityBabelTranform(file) {
    switch (cfg.compatibilityMode) {
      case compatibilityModes.AUTO:
        return file.uaCompat.browserTarget
          ? getAutoCompatibilityBabelTranform(file)
          : // fall back to max if browser target couldn't be found
            maxCompatibilityTransform;
      case compatibilityModes.MIN:
        return minCompatibilityTransform;
      case compatibilityModes.MAX:
        return maxCompatibilityTransform;
      case compatibilityModes.NONE:
        return createBabelTransform(cfg);
      default:
        throw new Error(`Unknown compatibility mode: ${cfg.compatibilityMode}`);
    }
  }

  /**
   * Returns whether we should do a babel transform, we try to minimize this for performance.
   * @param {FileData} file
   * @returns {boolean}
   */
  function shouldTransformBabel(file) {
    const customUserTransform = cfg.customBabelConfig || cfg.readUserBabelConfig;
    // no compatibility and no custom user transform
    if (cfg.compatibilityMode === compatibilityModes.NONE && !customUserTransform) {
      return false;
    }

    const autoModernTransform =
      cfg.compatibilityMode === compatibilityModes.AUTO && file.uaCompat.modern;

    // auto transform can be skipped for modern browsers if there is no user-defined config
    if (!customUserTransform && autoModernTransform) {
      return false;
    }

    const excludeFromModern = cfg.babelModernExclude.some(pattern =>
      minimatch(file.filePath, pattern),
    );
    const onlyModernTransform =
      !customUserTransform &&
      file.uaCompat.modern &&
      cfg.compatibilityMode !== compatibilityModes.MAX;

    // if this is only a modern transform, we can skip it if this file is excluded
    if (onlyModernTransform && excludeFromModern) {
      return false;
    }

    // we need to run babel if compatibility mode is not none, or the user has defined a custom config
    return cfg.compatibilityMode !== compatibilityModes.NONE || customUserTransform;
  }

  /**
   * Returns whether we should transform modules to systemjs
   * @param {FileData} file
   * @returns {boolean}
   */
  function shouldTransformModules(file) {
    switch (cfg.compatibilityMode) {
      case compatibilityModes.AUTO:
        return !file.uaCompat.supportsEsm;
      case compatibilityModes.MAX:
        return true;
      default:
        return false;
    }
  }

  /**
   * @param {FileData} file
   */
  async function compatibilityTransform(file) {
    const excludeFromBabel = cfg.babelExclude.some(pattern => minimatch(file.filePath, pattern));
    const transformBabel = !excludeFromBabel && shouldTransformBabel(file);
    const transformModules = !excludeFromBabel && shouldTransformModules(file);
    let transformedCode = file.code;

    /**
     * Transform code to a compatible format based on the compatibility setting. We keep ESM syntax
     * in this step, this will be transformed later if necessary.
     */
    if (transformBabel) {
      const compatTransform = getCompatibilityBabelTranform(file);
      transformedCode = await compatTransform(file.filePath, transformedCode);
    }

    /**
     * Resolve module imports. This isn't a babel plugin because if only node-resolve is configured,
     * we don't need to run babel which makes it a lot faster
     */
    if (cfg.nodeResolve) {
      transformedCode = await resolveModuleImports(cfg.rootDir, file.filePath, transformedCode, {
        fileExtensions,
        moduleDirectories: cfg.moduleDirectories,
        preserveSymlinks: cfg.preserveSymlinks,
      });
    }

    /**
     * If this browser doesn't support es modules, compile it to systemjs using babel.
     */
    if (transformModules) {
      transformedCode = await polyfillModulesTransform(file.filePath, transformedCode);
    }

    return transformedCode;
  }

  return compatibilityTransform;
}
