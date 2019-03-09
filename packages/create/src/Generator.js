import path from 'path';
import commandLineArgs from 'command-line-args';

import { copyTemplates, copyTemplate, copyTemplateJsonInto, installNpm } from './core.js';
import { parseCliOptions } from './helpers.js';

const optionDefinitions = [
  { name: 'tag-name', type: String, defaultValue: '' },
  { name: 'no-npm', type: Boolean, defaultValue: false },
  { name: 'scaffold', type: String, defaultValue: '' },
];

export const cliOptions = commandLineArgs(optionDefinitions, { partial: true });

class Generator {
  constructor() {
    this._destinationPath = process.cwd();
    this.templateData = {};
    this.cliOptions = parseCliOptions(cliOptions);
    this._noNpm = this.cliOptions['no-npm'];
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
    if (!this._noNpm) {
      await installNpm(this._destinationPath);
    }
  }
}

export default Generator;
