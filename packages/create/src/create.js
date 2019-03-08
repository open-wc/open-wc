#!/usr/bin/env node

/* eslint-disable no-console */

import fs from 'fs';
import { executeMixinGenerator } from './core.js';

(async () => {
  const name = process.argv[2];
  let fullGeneratorPath = `${__dirname}/generators/app/index.js`;
  if (name) {
    fullGeneratorPath = `${__dirname}/generators/${name}/index.js`;
  }

  if (!fs.existsSync(fullGeneratorPath)) {
    console.log(`Could not find generator at ${fullGeneratorPath}.`);
    return;
  }

  try {
    const module = await import(fullGeneratorPath);
    await executeMixinGenerator(module.default);
  } catch (err) {
    console.log(err);
  }
})();
