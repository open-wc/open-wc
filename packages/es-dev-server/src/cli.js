#!/usr/bin/env node
import { startServer } from './server.js';
import readCommandLineArgs from './command-line-args';

const config = readCommandLineArgs();

startServer(config);
