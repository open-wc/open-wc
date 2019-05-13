#!/usr/bin/env node

/* eslint-disable no-console */

import semver from 'semver';
import chalk from 'chalk';
import { executeMixinGenerator } from './core.js';
import { AppMixin } from './generators/app/index.js';

(async () => {
  try {
    if (semver.lte(process.version, '10.12.0')) {
      console.log(chalk.bgRed('\nUh oh! Looks like you dont have Node v10.12.0 installed!\n'));
      console.log(`You can do this by going to ${chalk.underline.blue(`https://nodejs.org/`)}

Or if you use nvm:
  $ nvm install node ${chalk.gray(`# "node" is an alias for the latest version`)}
  $ nvm use node
`);
    } else {
      await executeMixinGenerator([AppMixin]);
    }
  } catch (err) {
    console.log(err);
  }
})();
