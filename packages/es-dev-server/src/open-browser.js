import opn from 'opn';

/**
 * @typedef {object} OpenBrowserConfig
 * @property {string} appIndex
 * @property {boolean} openBrowser
 * @property {string} openPath
 * @property {string} rootDir
 * @property {string} hostname
 * @property {number} port
 * @property {boolean} logStartup
 * @property {boolean} http2
 */

/**
 * @param {OpenBrowserConfig} cfg
 */
export function openBrowserAndLogStartup(cfg) {
  const prettyHost = cfg.hostname === '127.0.0.1' ? 'localhost' : cfg.hostname;

  if (cfg.logStartup) {
    const msgs = [];
    msgs.push(`owc-dev-server started on http://${prettyHost}:${cfg.port}`);
    msgs.push(`  Serving files from '${cfg.rootDir}'.`);

    if (cfg.openBrowser) {
      msgs.push(`  Opening browser on '${cfg.openPath}'`);
    }

    if (cfg.appIndex) {
      msgs.push(`  Using history API fallback, redirecting non-file requests to '${cfg.appIndex}'`);
    }

    /* eslint-disable-next-line no-console */
    console.log(msgs.join('\n'));
  }

  if (cfg.openBrowser) {
    opn(`http${cfg.http2 ? 's' : ''}://${prettyHost}:${cfg.port}${cfg.openPath}`);
  }
}
