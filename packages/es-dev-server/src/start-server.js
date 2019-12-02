import opn from 'opn';
import chokidar from 'chokidar';
import portfinder from 'portfinder';
import { URL } from 'url';
import { createServer } from './create-server.js';

function isValidURL(str) {
  try {
    return !!new URL(str);
  } catch (error) {
    return false;
  }
}

/** @param {import('./config.js').InternalConfig} cfg */
export async function startServer(cfg, fileWatcher = chokidar.watch([])) {
  const result = createServer(cfg, fileWatcher);
  const { app } = result;
  let { server } = result;

  const port = typeof cfg.port === 'number' ? cfg.port : await portfinder.getPortPromise();

  // cleanup after quit
  function closeFileWatcher() {
    if (fileWatcher) {
      fileWatcher.close();
      /* eslint-disable-next-line no-param-reassign */
      fileWatcher = undefined;
    }
  }

  server.addListener('close', closeFileWatcher);

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
      const prettyHost = cfg.hostname || 'localhost';

      if (cfg.logStartup) {
        const msgs = [];
        msgs.push(`es-dev-server started on http${cfg.http2 ? 's' : ''}://${prettyHost}:${port}`);
        msgs.push(`  Serving files from '${cfg.rootDir}'.`);
        if (cfg.sslKey && cfg.sslCert) {
          msgs.push(`  using key '${cfg.sslKey}'`);
          msgs.push(`  and cert '${cfg.sslCert}'`);
        }
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
        const openPath = (() => {
          if (isValidURL(cfg.openPath)) {
            return cfg.openPath;
          }

          return new URL(cfg.openPath, `http${cfg.http2 ? 's' : ''}://${prettyHost}:${port}`).href;
        })();

        opn(openPath);
      }

      resolve();
    }),
  );

  return {
    server,
    app,
  };
}
