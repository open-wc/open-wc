const Generator = require('yeoman-generator');

module.exports = class GeneratorPublishStorybook extends Generator {
  initializing() {
    if (Object.keys(this.config.getAll()).length === 0) {
      this.composeWith(require.resolve('../get-tag-name'), {
        __store: this.config,
      });
    }
  }

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

  default() {
    this.composeWith(require.resolve('../demoing'), this.config.getAll());
  }

  install() {
    this.npmInstall();
  }
};
