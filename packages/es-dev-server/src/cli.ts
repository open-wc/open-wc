#!/usr/bin/env node
import { startServer, createConfig } from './es-dev-server';
import { readCommandLineArgs } from './command-line-args';
import { logDebug } from './utils/utils';

const config = createConfig({ ...readCommandLineArgs(), logErrorsToBrowser: true });
logDebug('Starting server with config: ', config);
startServer(config);

['exit', 'SIGINT'].forEach(event => {
  // @ts-ignore
  process.on(event, () => {
    process.exit(0);
  });
});
