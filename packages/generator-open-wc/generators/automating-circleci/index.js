const Generator = require('yeoman-generator');

module.exports = class GeneratorAutomatingCircleci extends Generator {
  writing() {
    // write everything else
    this.fs.copyTpl(
      this.templatePath('static/**/*'),
      this.destinationPath(),
      this.config.getAll(),
      undefined,
      { globOptions: { dot: true } },
    );
  }
};
