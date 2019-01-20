const Generator = require('yeoman-generator');

module.exports = class GeneratorTestingBare extends Generator {
  initializing() {
    if (Object.keys(this.config.getAll()).length === 0) {
      this.composeWith(require.resolve('../get-tag-name'), {
        __store: this.config,
      });
    }
  }

  writing() {
    const tagName = this.config.get('tagName');

    // test file
    this.fs.copyTpl(
      this.templatePath('my-el.test.js'),
      this.destinationPath(`test/${tagName}.test.js`),
      this.config.getAll(),
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

  default() {
    this.composeWith(require.resolve('../testing'), this.config.getAll());
  }
};
