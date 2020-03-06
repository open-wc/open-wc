import { PolyfillsConfig } from 'polyfills-loader';

export interface LegacyBuildConfig {
  name: string;
  test: string;
}

export interface PluginOptions {
  htmlFileName?: string;
  modernOutput?: string;
  legacyOutput?: LegacyBuildConfig | LegacyBuildConfig[];
  polyfills?: PolyfillsConfig;
}
