import opn from 'opn';
import chokidar from 'chokidar';
import portfinder from 'portfinder';
import { URL } from 'url';
import { createServer } from './create-server.js';
import { compatibilityModes } from './constants.js';

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

  async function stopServer() {
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

  if (cfg.onServerStart) {
    await cfg.onServerStart(cfg);
  }

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
            `  Using history API fallback, redirecting route requests to '${cfg.appIndex}'`,
          );
        }

        if (cfg.compatibilityMode === compatibilityModes.AUTO) {
          msgs.push(
            `  Using auto compatibility mode, transforming code on older browsers based on user agent.`,
          );
        } else if (cfg.compatibilityMode === compatibilityModes.ALWAYS) {
          msgs.push(`  Using always compatibility mode, transforming code based on user agent.`);
        } else if (cfg.compatibilityMode === compatibilityModes.MIN) {
          msgs.push(
            `  Using minimum compatibility mode, always transforming code for compatiblity with modern browsers.`,
          );
        } else if (cfg.compatibilityMode === compatibilityModes.MAX) {
          msgs.push(
            `  Using maximum compatibility mode, always transforming code to es5 for compatiblity with older browsers.`,
          );
        }

        const hasBabel = cfg.readUserBabelConfig || cfg.customBabelConfig;
        if (hasBabel) {
          msgs.push(`  Using a custom babel configuration.`);
        }

        if (
          hasBabel ||
          ![compatibilityModes.NONE, compatibilityModes.AUTO].includes(cfg.compatibilityMode)
        ) {
          msgs.push(
            `  \nes-dev-server is configured to always compile code. For the fastest dev experience, use compatibility auto without any custom babel configuration.`,
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
