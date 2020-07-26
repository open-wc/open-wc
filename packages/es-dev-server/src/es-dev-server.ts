import { FSWatcher } from 'chokidar';
import { createMiddlewares as originalCreateMiddlewares } from './create-middlewares';
import { ParsedConfig } from './config';

export * from './create-server';
export * from './start-server';
export * from './command-line-args';
export * from './config';
export * from './constants';
export * from './Plugin';
export * from './utils/MessageChannel';

// Backwards compatibility, the public API expects an array while we are exporting an object now
export function createMiddlewares(config: ParsedConfig, fileWatcher: FSWatcher) {
  return originalCreateMiddlewares(config, fileWatcher).middlewares;
}
