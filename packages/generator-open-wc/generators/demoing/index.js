const Generator = require('yeoman-generator');

module.exports = class GeneratorDemoing extends Generator {
  configuring() {
    this.composeWith(require.resolve('../demoing-storybook'), this.config.getAll());
  }

  install() {
    this.npmInstall();
  }
};
