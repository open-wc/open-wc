import path from 'path';
import qoa from 'qoa';
import commandLineArgs from 'command-line-args';

import { copyTemplates, copyTemplate, copyTemplateJsonInto, installNpm } from './core.js';
import { parseCliOptions } from './helpers.js';

const optionDefinitions = [
  { name: 'tag-name', type: String, defaultValue: '' },
  { name: 'npm-install', type: String, defaultValue: 'true' }, // set to emptry string later
  { name: 'scaffold', type: String, defaultValue: '' },
];

export const cliOptions = commandLineArgs(optionDefinitions, { partial: true });

class Generator {
  constructor() {
    this._destinationPath = process.cwd();
    this.templateData = {};
    this.wantsNpmInstall = '';
    this.cliOptions = parseCliOptions(cliOptions);
  }

  // eslint-disable-next-line class-methods-use-this
  execute() {}

  destinationPath(destination = '') {
    return path.join(this._destinationPath, destination);
  }

  copyTemplate(from, to) {
    copyTemplate(from, to, this.templateData);
  }

  copyTemplateJsonInto(from, to) {
    copyTemplateJsonInto(from, to, this.templateData);
  }

  async copyTemplates(from, to = this.destinationPath()) {
    return copyTemplates(from, to, this.templateData);
  }

  async end() {
    const { command } = await qoa.prompt([
      {
        type: 'interactive',
        query: 'Do you want to install dependencies?',
        handle: 'command',
        symbol: '>',
        menu: ['Yes, with yarn', 'Yes, with npm', 'No'],
      },
    ]);

    this.wantsNpmInstall = this.cliOptions['npm-install'];
    if (this.wantsNpmInstall && command !== 'No') {
      await installNpm(this._destinationPath, command.split('Yes, with ').slice(-1)[0]);
    }
  }
}

export default Generator;
