import { PolyfillsLoaderConfig } from '../utils/inject-polyfills-loader-types';
import { TransformJs } from '../utils/compatibility-transform';

export interface PolyfillsLoaderMiddlewareConfig {
  compatibilityMode: string;
  appIndex: string;
  rootDir: string;
  polyfillsLoaderConfig?: Partial<PolyfillsLoaderConfig>;
  transformJs: TransformJs;
}
