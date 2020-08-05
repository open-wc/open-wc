import { PluginOptions } from '@open-wc/rollup-plugin-html';

export interface BasicOptions {
  outputDir?: string;
  nodeResolve?: boolean | object;
  babel?: boolean | object;
  terser?: boolean | object;
  legacyBuild?: boolean;
  developmentMode?: boolean;
  rootDir?: string;
}

export interface SpaOptions extends BasicOptions {
  html?: boolean | PluginOptions;
  polyfillsLoader?: boolean | object;
  workbox?: boolean | WorkboxOptions;
  injectServiceWorker?: boolean;
}

export interface MpaOptions extends SpaOptions {}

interface WorkboxOptions {
  swDest?: string;
  globDirectory?: string;
}
