import { Context, Middleware } from 'koa';
import { FSWatcher } from 'chokidar';
import { isGeneratedFile, getRequestFilePath } from '../utils/utils';

export interface WatchServedFilesMiddlewareConfig {
  rootDir: string;
  fileWatcher: FSWatcher;
}

async function watchServedFile(ctx: Context, cfg: WatchServedFilesMiddlewareConfig) {
  const filePath = getRequestFilePath(ctx, cfg.rootDir);

  if (!filePath || isGeneratedFile(ctx.url)) {
    return;
  }

  cfg.fileWatcher.add(filePath);
}

/**
 * Sets up a middleware which tracks served files and sends a reload message to any
 * active browsers when any of the files change.
 */
export function createWatchServedFilesMiddleware(
  cfg: WatchServedFilesMiddlewareConfig,
): Middleware {
  return async function watchServedFilesMiddleware(ctx, next) {
    await next();

    watchServedFile(ctx, cfg);
  };
}
