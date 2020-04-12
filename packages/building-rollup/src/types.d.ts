export interface BasicOptions {
  outputDir?: string;
  nodeResolve?: boolean | object;
  babel?: boolean | object;
  terser?: boolean | object;
  legacyBuild?: boolean;
  developmentMode?: boolean;
}

export interface SpaOptions extends BasicOptions {
  html?: boolean | object;
  polyfillsLoader?: boolean | object;
  workbox?: boolean | object;
}
