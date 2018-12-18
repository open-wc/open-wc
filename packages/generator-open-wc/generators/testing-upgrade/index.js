const Generator = require('yeoman-generator');

module.exports = class GeneratorVanilla extends Generator {
  default() {
    this.composeWith(require.resolve('../testing-karma'), this.config.getAll());
    this.composeWith(require.resolve('../testing-karma-bs'), this.config.getAll());
  }
};
