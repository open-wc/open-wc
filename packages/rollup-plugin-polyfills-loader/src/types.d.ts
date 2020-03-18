import { PolyfillsConfig, FileType } from 'polyfills-loader';

export interface OutputConfig {
  name: string;
  type?: FileType;
}

export interface LegacyOutputConfig extends OutputConfig {
  test: string;
}

export interface PluginOptions {
  htmlFileName?: string;
  modernOutput?: OutputConfig;
  legacyOutput?: LegacyOutputConfig | LegacyOutputConfig[];
  polyfills?: PolyfillsConfig;
}
