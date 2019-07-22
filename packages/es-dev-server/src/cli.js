#!/usr/bin/env node
import { startServer } from './server.js';
import readCommandLineArgs from './command-line-args.js';

const config = readCommandLineArgs();

startServer(config);
