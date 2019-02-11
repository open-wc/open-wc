const Generator = require('yeoman-generator');

module.exports = class GeneratorAutomating extends Generator {
  default() {
    this.composeWith(require.resolve('../automating-circleci'), this.config.getAll());
  }

  install() {
    this.npmInstall();
  }
};
