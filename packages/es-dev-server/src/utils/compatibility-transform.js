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
   * @param {FileData} file
   */
  async function compatibilityTransform(file) {
    let transformedCode = file.code;
    const isExcluded = cfg.babelExclude.some(pattern => minimatch(file.filePath, pattern));
    // Modern browsers don't need any transformation, so we avoid parsing with babel for performance.
    const skipBabelTransform =
      !cfg.customBabelConfig &&
      !cfg.readUserBabelConfig &&
      cfg.compatibilityMode === compatibilityModes.AUTO &&
      file.uaCompat.modern;
    const transformModules =
      (!skipBabelTransform &&
        cfg.compatibilityMode === compatibilityModes.AUTO &&
        !file.uaCompat.supportsEsm) ||
      cfg.compatibilityMode === compatibilityModes.MAX;

    /**
     * Transform code to a compatible format based on the compatibility setting. We keep ESM syntax
     * in this step, this will be transformed later if necessary.
     */
    if (!isExcluded && !skipBabelTransform) {
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
