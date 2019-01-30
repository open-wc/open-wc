const Generator = require('yeoman-generator');

module.exports = class GeneratorBuilding extends Generator {
  default() {
    this.composeWith(require.resolve('../building-webpack'), this.config.getAll());
  }
};
