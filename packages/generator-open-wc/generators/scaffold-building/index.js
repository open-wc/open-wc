const Generator = require('yeoman-generator');

module.exports = class GeneratorScaffoldBuilding extends Generator {
  initializing() {
    if (Object.keys(this.config.getAll()).length === 0) {
      this.composeWith(require.resolve('../get-tag-name'), {
        __store: this.config,
      });
    }
  }

  configuring() {
    this.composeWith(require.resolve('../building'), this.config.getAll());
  }

  default() {
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
