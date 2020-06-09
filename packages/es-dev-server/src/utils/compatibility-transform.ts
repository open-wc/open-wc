import { TransformOptions } from '@babel/core';
import { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';
import { BabelTransform } from './babel-transform';
import { UserAgentCompat } from './user-agent-compat';
import minimatch from 'minimatch';
import {
  createCompatibilityBabelTransform,
  createMinCompatibilityBabelTransform,
  createMaxCompatibilityBabelTransform,
  polyfillModulesTransform,
  createBabelTransform,
} from './babel-transform';
import { compatibilityModes } from '../constants';
import { logDebug } from './utils';

export interface CompatibilityTransformConfig {
  rootDir: string;
  readUserBabelConfig: boolean;
  nodeResolve: boolean | RollupNodeResolveOptions;
  compatibilityMode: string;
  customBabelConfig?: TransformOptions;
  fileExtensions: string[];
  babelExclude: string[];
  babelModernExclude: string[];
  babelModuleExclude: string[];
}

export interface FileData {
  uaCompat: UserAgentCompat;
  filePath: string;
  code: string;
  transformModule: boolean;
}

export type TransformJs = (file: FileData) => Promise<string>;

export function createCompatibilityTransform(cfg: CompatibilityTransformConfig): TransformJs {
  /** @type {Map} */
  const babelTransforms = new Map<string, BabelTransform>();
  const minCompatibilityTransform = createMinCompatibilityBabelTransform(cfg);
  const maxCompatibilityTransform = createMaxCompatibilityBabelTransform(cfg);

  /**
   * Gets the babel compatibility transform for the given user agent. Caches
   * babel previously created configs.
   */
  function getAutoCompatibilityBabelTranform(file: FileData) {
    const { browserTarget } = file.uaCompat;
    if (!browserTarget) {
      throw new Error('No browsertarget');
    }

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

  function isAutoModernTransform(file: FileData) {
    return cfg.compatibilityMode === compatibilityModes.AUTO && file.uaCompat.modern;
  }

  /**
   * Gets the compatibility transform function based on the compatibility
   * mode.
   */
  function getCompatibilityBabelTranform(file: FileData) {
    switch (cfg.compatibilityMode) {
      case compatibilityModes.AUTO:
      case compatibilityModes.ALWAYS: {
        // if this is an auto modern transform, we can skip compatibility transformation
        // and just do the custom user transformation
        if (cfg.compatibilityMode === compatibilityModes.AUTO && isAutoModernTransform(file)) {
          return createBabelTransform(cfg);
        }

        return file.uaCompat.browserTarget
          ? getAutoCompatibilityBabelTranform(file)
          : // fall back to max if browser target couldn't be found
            maxCompatibilityTransform;
      }
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
   */
  function shouldTransformBabel(file: FileData) {
    const customUserTransform = cfg.customBabelConfig || cfg.readUserBabelConfig;
    // no compatibility and no custom user transform
    if (cfg.compatibilityMode === compatibilityModes.NONE && !customUserTransform) {
      return false;
    }

    // auto transform can be skipped for modern browsers if there is no user-defined config
    if (!customUserTransform && isAutoModernTransform(file)) {
      return false;
    }

    const excludeFromModern = cfg.babelModernExclude.some(pattern =>
      minimatch(file.filePath, pattern),
    );
    const onlyModernTransform =
      file.uaCompat.modern && cfg.compatibilityMode !== compatibilityModes.MAX;

    // if this is only a modern transform, we can skip it if this file is excluded
    if (onlyModernTransform && excludeFromModern) {
      return false;
    }

    // we need to run babel if compatibility mode is not none, or the user has defined a custom config
    return cfg.compatibilityMode !== compatibilityModes.NONE || customUserTransform;
  }

  /**
   * Returns whether we should transform modules to systemjs
   */
  function shouldTransformModules(file: FileData) {
    if (cfg.babelModuleExclude.some(pattern => minimatch(file.filePath, pattern))) {
      return false;
    }

    return file.transformModule;
  }

  async function compatibilityTransform(file: FileData) {
    const excludeFromBabel = cfg.babelExclude.some(pattern => minimatch(file.filePath, pattern));
    const transformBabel = !excludeFromBabel && shouldTransformBabel(file);
    const transformModules = shouldTransformModules(file);
    let transformedCode = file.code;

    logDebug(
      `Compatibility transform babel: ${transformBabel}, ` +
        `modules: ${transformModules} ` +
        `for request: ${file.filePath}`,
    );

    /**
     * Transform code to a compatible format based on the compatibility setting. We keep ESM syntax
     * in this step, this will be transformed later if necessary.
     */
    if (transformBabel) {
      const compatTransform = getCompatibilityBabelTranform(file);
      transformedCode = await compatTransform(file.filePath, transformedCode);
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
