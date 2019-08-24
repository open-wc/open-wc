import Koa from 'koa';
import path from 'path';
import httpServer from 'http';
import http2Server from 'http2';
import fs from 'fs';
import { createMiddlewares } from './create-middlewares.js';

/**
 * Creates a koa server with middlewares, but does not start it. Returns the koa app and
 * http server instances.
 *
 * @param {import('./config').InternalConfig} cfg the server configuration
 * @param {import('chokidar').FSWatcher} fileWatcher
 * @returns {{ app: import('koa'), server: import('http').Server | import('http2').Http2SecureServer }}
 */
export function createServer(cfg, fileWatcher) {
  const middlewares = createMiddlewares(cfg, fileWatcher);

  const app = new Koa();
  middlewares.forEach(middleware => {
    app.use(middleware);
  });

  let server;
  if (cfg.http2) {
    const dir = path.join(__dirname, '..');
    const options = {
      key: fs.readFileSync(path.join(dir, '.self-signed-dev-server-ssl.key')),
      cert: fs.readFileSync(path.join(dir, '.self-signed-dev-server-ssl.cert')),
      allowHTTP1: true,
    };

    server = http2Server.createSecureServer(options, app.callback());
  } else {
    server = httpServer.createServer(app.callback());
  }

  return {
    server,
    app,
  };
}
