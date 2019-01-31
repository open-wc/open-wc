const Generator = require('yeoman-generator');

module.exports = class GeneratorApp extends Generator {
  default() {
    this.composeWith(require.resolve('../linting'), this.config.getAll());
    this.composeWith(require.resolve('../testing'), this.config.getAll());
    this.composeWith(require.resolve('../demoing'), this.config.getAll());
    this.composeWith(require.resolve('../automating'), this.config.getAll());
  }
};
