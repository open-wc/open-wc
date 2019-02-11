const Generator = require('yeoman-generator');

module.exports = class GeneratorTesting extends Generator {
  default() {
    this.composeWith(require.resolve('../testing-karma'), this.config.getAll());
    this.composeWith(require.resolve('../testing-karma-bs'), this.config.getAll());
  }

  writing() {
    // extend package.json
    this.fs.extendJSON(
      this.destinationPath('package.json'),
      this.fs.readJSON(this.templatePath('_package.json')),
    );
  }

  install() {
    this.npmInstall();
  }
};
