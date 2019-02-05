/* eslint-disable no-console */

const Generator = require('yeoman-generator');
const inquirer = require('inquirer');

const choices = {
  appStarter: 'Create Open Web Components Starter App',
  appProduction:
    'Create Open Web Components Enterprise App Setup (if you feel lost use the Starter App first)',
  separator1: new inquirer.Separator(),
  wcVanilla: 'Create a vanilla web component following the Open Web Components recommendations',
  wcUpgrade: 'Upgrade my existing web component to use the Open Web Components recommendations',
  separator2: new inquirer.Separator(),
  nothing: 'Nah, I am fine thanks! => exit',
};

module.exports = class GeneratorApp extends Generator {
  async prompting() {
    console.log('');
    console.log('Welcome to Open Web Components:');
    console.log('');

    this.answers = await this.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do today?',
        choices: Object.values(choices),
      },
    ]);

    switch (this.answers.action) {
      case choices.appStarter:
        this.composeWith(require.resolve('../starter-app'), this.config.getAll());
        break;
      case choices.appProduction:
        console.log('I am sorry - this is not yet available');
        console.log('Join the conversion: https://github.com/open-wc/open-wc/issues/197');
        // this.composeWith(require.resolve('../app-production'), this.config.getAll());
        break;
      case choices.wcVanilla:
        this.composeWith(require.resolve('../scaffold-vanilla'), this.config.getAll());
        break;
      case choices.wcUpgrade:
        this.composeWith(require.resolve('../upgrade'), this.config.getAll());
        break;
      case choices.nothing:
        console.log('Ok, bye - see ya next time');
        break;
      default:
        console.log('You didnt make a choice!');
    }
  }

  install() {
    this.npmInstall();
  }
};
