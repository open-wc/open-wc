import Koa, { Context } from 'koa';
import { FSWatcher } from 'chokidar';
import { Server } from 'net';
import { ParsedConfig } from './config';

type ServeResult = void | { body: string; type?: string; headers?: Record<string, string> };
type TransformResult = void | { body?: string; headers?: Record<string, string> };
type ResolveResult = void | string | Promise<void> | Promise<string>;

interface ServerArgs {
  config: ParsedConfig;
  app: Koa;
  server: Server;
  fileWatcher: FSWatcher;
}

export interface Plugin {
  serverStart?(args: ServerArgs): void | Promise<void>;
  serve?(context: Context): ServeResult | Promise<ServeResult>;
  transform?(context: Context): TransformResult | Promise<TransformResult>;
  resolveImport?(args: { source: string; context: Context }): ResolveResult;
  resolveMimeType?(context: Context): undefined | string | Promise<undefined | string>;
}
