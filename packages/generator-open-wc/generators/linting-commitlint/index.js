const Generator = require('yeoman-generator');

module.exports = class GeneratorLintingCommitlint extends Generator {
  default() {
    // extend package.json
    this.fs.extendJSON(
      this.destinationPath('package.json'),
      this.fs.readJSON(this.templatePath('_package.json')),
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
