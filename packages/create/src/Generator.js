/* eslint-disable no-console */
import prompts from 'prompts';
import path from 'path';

import {
  copyTemplates,
  copyTemplate,
  copyTemplateJsonInto,
  installNpm,
  writeFilesToDisk,
  optionsToCommand,
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
    this.wantsRecreateInfo = true;
  }

  execute() {
    if (this.options.tagName) {
      const { tagName } = this.options;
      const className = getClassName(tagName);
      this.templateData = { ...this.templateData, tagName, className };
      if (this.options.type === 'scaffold') {
        this._destinationPath = path.join(process.cwd(), tagName);
      }
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
      this.options.writeToDisk = await writeFilesToDisk();
    }

    if (this.wantsNpmInstall) {
      const answers = await prompts(
        [
          {
            type: 'select',
            name: 'installDependencies',
            message: 'Do you want to install dependencies?',
            choices: [
              { title: 'No', value: 'false' },
              { title: 'Yes, with yarn', value: 'yarn' },
              { title: 'Yes, with npm', value: 'npm' },
            ],
          },
        ],
        {
          onCancel: () => {
            process.exit();
          },
        },
      );
      this.options.installDependencies = answers.installDependencies;
      const { installDependencies } = this.options;
      if (installDependencies === 'yarn' || installDependencies === 'npm') {
        await installNpm(this._destinationPath, installDependencies);
      }
    }

    if (this.wantsRecreateInfo) {
      console.log('');
      console.log('If you want to rerun this exact same generator you can do so by executing:');
      console.log(optionsToCommand(this.options));
    }
  }
}

export default Generator;
