const Generator = require('yeoman-generator');

module.exports = class GeneratorLintingPrettier extends Generator {
  default() {
    // extend package.json
    this.fs.extendJSON(
      this.destinationPath('package.json'),
      this.fs.readJSON(this.templatePath('_package.json')),
    );

    this.fs.copy(
      this.templatePath('_prettier.config.js'),
      this.destinationPath('prettier.config.js'),
    );

    // write everything else
    this.fs.copyTpl(
      this.templatePath('static/**/*'),
      this.destinationPath(),
      this.config.getAll(),
      undefined,
      { globOptions: { dot: true } },
    );
  }

  install() {
    this.npmInstall();
  }
};
