import opn from 'opn';
import chokidar from 'chokidar';
import portfinder from 'portfinder';
import { createServer } from './create-server.js';

/** @param {import('./config.js').InternalConfig} cfg */
export async function startServer(cfg) {
  let fileWatcher = cfg.watch ? chokidar.watch([]) : undefined;

  const result = createServer(cfg, fileWatcher);
  const { app } = result;
  let { server } = result;

  const port = typeof cfg.port === 'number' ? cfg.port : await portfinder.getPortPromise();

  // cleanup after quit
  server.addListener('close', () => {
    if (fileWatcher) {
      fileWatcher.close();
      fileWatcher = undefined;
    }
  });

  function stopServer() {
    if (server) {
      server.close();
      server = undefined;
    }
  }

  ['exit', 'SIGINT'].forEach(event => {
    // @ts-ignore
    process.on(event, stopServer);
  });

  process.on('uncaughtException', error => {
    /* eslint-disable-next-line no-console */
    console.error(error);
    stopServer();
  });

  // start the server, open the browser and log messages
  await new Promise(resolve =>
    server.listen({ port, host: cfg.hostname }, () => {
      const prettyHost = cfg.hostname === '127.0.0.1' ? 'localhost' : cfg.hostname;

      if (cfg.logStartup) {
        const msgs = [];
        msgs.push(`es-dev-server started on http${cfg.http2 ? 's' : ''}://${prettyHost}:${port}`);
        msgs.push(`  Serving files from '${cfg.rootDir}'.`);

        if (cfg.openBrowser) {
          msgs.push(`  Opening browser on '${cfg.openPath}'`);
        }

        if (cfg.appIndex) {
          msgs.push(
            `  Using history API fallback, redirecting non-file requests to '${cfg.appIndex}'`,
          );
        }

        /* eslint-disable-next-line no-console */
        console.log(msgs.join('\n'));
      }

      if (cfg.openBrowser) {
        opn(`http${cfg.http2 ? 's' : ''}://${prettyHost}:${port}${cfg.openPath}`);
      }

      resolve();
    }),
  );

  return {
    server,
    app,
  };
}
