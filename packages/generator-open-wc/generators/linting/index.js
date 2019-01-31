const Generator = require('yeoman-generator');

module.exports = class GeneratorLinting extends Generator {
  default() {
    this.composeWith(require.resolve('../linting-eslint'), this.config.getAll());
    this.composeWith(require.resolve('../linting-prettier'), this.config.getAll());
    this.composeWith(require.resolve('../linting-commitlint'), this.config.getAll());
  }

  writing() {
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
};
