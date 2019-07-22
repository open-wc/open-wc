import opn from 'opn';
import chokidar from 'chokidar';
import { createServer } from './create-server.js';

/** @param {import('./config.js').InternalConfig} cfg */
export function startServer(cfg) {
  const fileWatcher = cfg.watch ? chokidar.watch([]) : undefined;

  const { app, server } = createServer(cfg, fileWatcher);

  // start the server, open the browser and log messages
  server.listen({ port: cfg.port, host: cfg.hostname }, () => {
    const prettyHost = cfg.hostname === '127.0.0.1' ? 'localhost' : cfg.hostname;

    if (cfg.logStartup) {
      const msgs = [];
      msgs.push(`es-dev-server started on http${cfg.http2 ? 's' : ''}://${prettyHost}:${cfg.port}`);
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
      opn(`http${cfg.http2 ? 's' : ''}://${prettyHost}:${cfg.port}${cfg.openPath}`);
    }
  });

  // cleanup after quit
  server.addListener('close', () => {
    if (fileWatcher) {
      fileWatcher.close();
    }
  });

  return {
    server,
    app,
  };
}
