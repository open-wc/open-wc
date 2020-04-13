import { join } from 'path';

const COMMAND_PATH = join(__dirname, '../src/create.js');

export function generateCommand({ destinationPath = '.' } = {}) {
  return `node -r @babel/register ${COMMAND_PATH} \
      --destinationPath ${destinationPath} \
      --type scaffold \
      --scaffoldType app \
      --features linting testing demoing building \
      --scaffoldFilesFor testing demoing building \
      --tagName scaffold-app \
      --writeToDisk true \
      --installDependencies false
  `;
}
