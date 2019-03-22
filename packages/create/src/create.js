#!/usr/bin/env node

/* eslint-disable no-console */

import fs from 'fs';
import semver from 'semver';
import chalk from 'chalk';
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
    if (semver.lte(process.version, '10.12.0')) {
      console.log(chalk.bgRed('\nUh oh! Looks like you dont have Node v10.12.0 installed!\n'));
      console.log(`You can do this by going to ${chalk.underline.blue(`https://nodejs.org/`)}

Or if you use nvm:
  $ nvm install node ${chalk.gray(`# "node" is an alias for the latest version`)}
  $ nvm use node
`);
    } else {
      const module = await import(fullGeneratorPath);
      await executeMixinGenerator(module.default);
    }
  } catch (err) {
    console.log(err);
  }
})();
