import { join } from 'path';

import { existsSync } from 'fs';

import { execSync } from 'child_process';

import { generateCommand } from './generate-command.js';

const destinationPath = join(__dirname, './snapshots');

const UPDATE_SNAPSHOTS_COMMAND = generateCommand({ destinationPath });

execSync(UPDATE_SNAPSHOTS_COMMAND);

// HACK(bennyp): destinationPath doesn't work.
// see https://github.com/open-wc/open-wc/issues/1040
const OOPS_I_WROTE_TO_PACKAGE_ROOT = join(process.cwd(), './scaffold-app');

const DESTINATION_PATH = join(__dirname, './snapshots/fully-loaded-app');

if (existsSync(OOPS_I_WROTE_TO_PACKAGE_ROOT)) {
  execSync(`rm -rf ${DESTINATION_PATH}`);
  execSync(`mv -f ${OOPS_I_WROTE_TO_PACKAGE_ROOT} ${DESTINATION_PATH}`);
}
