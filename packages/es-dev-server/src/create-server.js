import Koa from 'koa';
import path from 'path';
import httpServer from 'http';
import http2Server from 'http2';
import fs from 'fs';
import chokidar from 'chokidar';
import net from 'net';
import { createMiddlewares } from './create-middlewares.js';

/**
 * A request handler that returns a 301 HTTP Redirect to the same location as the original
 * request but using the https protocol
 */
function httpsRedirect(req, res) {
  const { host } = req.headers;
  res.writeHead(301, { Location: `https://${host}${req.url}` });
  res.end();
}

/**
 * Creates a koa server with middlewares, but does not start it. Returns the koa app and
 * http server instances.
 *
 * @param {import('./config').InternalConfig} cfg the server configuration
 * @param {import('chokidar').FSWatcher} fileWatcher
 * @returns {{ app: import('koa'), server: net.Server | httpServer.Server }}
 */
export function createServer(cfg, fileWatcher = chokidar.watch([])) {
  const middlewares = createMiddlewares(cfg, fileWatcher);

  const app = new Koa();

  middlewares.forEach(middleware => {
    app.use(middleware);
  });

  let server;
  if (cfg.http2) {
    const dir = path.join(__dirname, '..');
    const options = {
      key: fs.readFileSync(
        cfg.sslKey ? cfg.sslKey : path.join(dir, '.self-signed-dev-server-ssl.key'),
      ),
      cert: fs.readFileSync(
        cfg.sslCert ? cfg.sslCert : path.join(dir, '.self-signed-dev-server-ssl.cert'),
      ),
      allowHTTP1: true,
    };

    const httpsRedirectServer = httpServer.createServer(httpsRedirect);
    const appServer = http2Server.createSecureServer(options, app.callback());
    let appServerPort;
    let httpsRedirectServerPort;

    /**
     * A connection handler that checks if the connection is using TLS
     */
    const httpRedirectProxy = connection => {
      connection.once('data', buffer => {
        // A TLS handshake record starts with byte 22.
        const address = buffer[0] === 22 ? appServerPort : httpsRedirectServerPort;
        const proxy = net.createConnection(address, () => {
          proxy.write(buffer);
          connection.pipe(proxy).pipe(connection);
        });
      });
    };

    server = net.createServer(httpRedirectProxy);

    server.addListener('close', () => {
      httpsRedirectServer.close();
      appServer.close();
    });

    server.addListener('listening', () => {
      const { address, port } = server.address();
      appServerPort = port + 1;
      httpsRedirectServerPort = port + 2;

      appServer.listen({ address, port: appServerPort });
      httpsRedirectServer.listen({ address, port: httpsRedirectServerPort });
    });

    const serverListen = server.listen.bind(server);
    server.listen = (config, callback) => {
      appServer.addListener('listening', callback);
      serverListen(config);
      return server;
    };
  } else {
    server = httpServer.createServer(app.callback());
  }

  return {
    server,
    app,
  };
}
