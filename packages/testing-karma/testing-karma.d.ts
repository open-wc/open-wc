/// <reference types="karma-mocha"/>
/// <reference types="karma-mocha-reporter"/>
/// <reference types="karma-coverage-istanbul-reporter"/>
import type { Config, ConfigOptions } from 'karma';
import type { KarmaEsmConfig } from '../karma-esm/src/esm-config';

declare module 'karma' {
  export interface Config {
    grep: string|RegExp;
  }

  export interface ConfigOptions {
    esm: KarmaEsmConfig
    snapshot: {
      update: boolean;
      prune: boolean;
      limitUnusedSnapshotsInWarning: number;
      pathResolver(basePath: string, suiteName: string): string;
    }
  }
}

export function createDefaultConfig(config: Config): ConfigOptions
