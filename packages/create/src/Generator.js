import path from 'path';

import {
  copyTemplates,
  copyTemplate,
  copyTemplateJsonInto,
  installNpm,
  writeFilesToDisk,
} from './core.js';

function getClassName(tagName) {
  return tagName
    .split('-')
    .reduce((previous, part) => previous + part.charAt(0).toUpperCase() + part.slice(1), '');
}

class Generator {
  constructor() {
    this._destinationPath = process.cwd();
    this.options = {};
    this.templateData = {};
    this.wantsNpmInstall = true;
    this.wantsWriteToDisk = true;
  }

  execute() {
    if (this.options.type === 'scaffold' && this.options.tagName) {
      const { tagName } = this.options;
      const className = getClassName(tagName);
      this._destinationPath = path.join(process.cwd(), tagName);
      this.templateData = { ...this.templateData, tagName, className };
    }
  }

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
    if (this.wantsWriteToDisk) {
      writeFilesToDisk();
    }

    if (this.wantsNpmInstall) {
      const { installDependencies } = this.options;
      if (installDependencies === 'yarn' || installDependencies === 'npm') {
        await installNpm(this._destinationPath, installDependencies);
      }
    }
  }
}

export default Generator;
