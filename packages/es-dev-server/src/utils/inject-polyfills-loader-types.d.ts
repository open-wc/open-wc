import { PolyfillsLoaderConfig as OriginalPolyfillsLoaderConfig } from 'polyfills-loader';
import { UserAgentCompat } from './user-agent-compat';
import { PolyfillsLoader } from 'polyfills-loader/src/create-polyfills-loader';
import { TransformJs } from './compatibility-transform';

export interface PolyfillsLoaderConfig extends OriginalPolyfillsLoaderConfig {
  exclude?: {
    jsModules?: boolean;
    inlineJsModules?: boolean;
    jsScripts?: boolean;
    inlineJsScripts?: boolean;
  };
}

export interface InjectPolyfillsLoaderConfig {
  compatibilityMode: string;
  uaCompat: UserAgentCompat;
  htmlString: string;
  indexUrl: string;
  indexFilePath: string;
  transformJs: TransformJs;
  polyfillsLoaderConfig?: Partial<PolyfillsLoaderConfig>;
}
