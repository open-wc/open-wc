const Generator = require('yeoman-generator');

module.exports = class GeneratorBuilding extends Generator {
  configuring() {
    this.composeWith(require.resolve('../building-webpack'), this.config.getAll());
  }

  install() {
    this.npmInstall();
  }
};
