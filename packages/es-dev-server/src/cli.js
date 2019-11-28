#!/usr/bin/env node
import { startServer, createConfig } from './es-dev-server.js';
import { readCommandLineArgs } from './command-line-args.js';
import { logDebug } from './utils/utils.js';

const config = createConfig({ ...readCommandLineArgs(), logErrorsToBrowser: true });
logDebug('Starting server with config: ', config);
startServer(config);

['exit', 'SIGINT'].forEach(event => {
  // @ts-ignore
  process.on(event, () => {
    process.exit(0);
  });
});
