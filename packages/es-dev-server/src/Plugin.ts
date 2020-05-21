import { FSWatcher } from 'chokidar';
import Koa, { Context } from 'koa';
import { Server } from 'net';
import { ParsedConfig } from './config';

type ServeResult =
  | undefined
  | null
  | { body: string; type?: string; headers?: Record<string, string> };
type TransformResult =
  | undefined
  | null
  | { body?: string; headers?: Record<string, string>; transformCache?: boolean };
type ResolveResult = undefined | null | string;
type ResolveMimeTypeResult = undefined | null | string;

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
  resolveImport?(args: {
    source: string;
    context: Context;
  }): ResolveResult | Promise<ResolveResult>;
  resolveMimeType?(context: Context): ResolveMimeTypeResult | Promise<ResolveMimeTypeResult>;
}
