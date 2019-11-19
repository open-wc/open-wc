#!/usr/bin/env node
import { startServer, createConfig } from './es-dev-server.js';
import { readCommandLineArgs } from './command-line-args.js';

const config = createConfig({ ...readCommandLineArgs(), logErrorsToBrowser: true });
startServer(config);

['exit', 'SIGINT'].forEach(event => {
  // @ts-ignore
  process.on(event, () => {
    process.exit(0);
  });
});
