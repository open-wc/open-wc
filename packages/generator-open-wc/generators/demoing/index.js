const Generator = require('yeoman-generator');

module.exports = class GeneratorDemoing extends Generator {
  default() {
    this.composeWith(require.resolve('../demoing-storybook'), this.config.getAll());
  }
};
