import path from 'path';
import httpServer from 'http';
import http2Server from 'http2';
import fs from 'fs';

/**
 * @param {*} requestListener
 * @param {boolean} http2
 */
export function createHTTPServer(requestListener, http2) {
  if (http2) {
    const dir = path.join(__dirname, '..');
    const options = {
      key: fs.readFileSync(path.join(dir, '.self-signed-dev-server-ssl.key')),
      cert: fs.readFileSync(path.join(dir, '.self-signed-dev-server-ssl.cert')),
      allowHTTP1: true,
    };

    return http2Server.createSecureServer(options, requestListener);
  }

  return httpServer.createServer(requestListener);
}
