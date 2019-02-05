const Generator = require('yeoman-generator');

module.exports = class GeneratorVanillaBare extends Generator {
  initializing() {
    if (Object.keys(this.config.getAll()).length === 0) {
      this.composeWith(require.resolve('../get-tag-name'), {
        __store: this.config,
      });
    }
  }

  configuring() {
    this.composeWith(require.resolve('../linting'), this.config.getAll());
    this.composeWith(require.resolve('../scaffold-testing'), this.config.getAll());
    this.composeWith(require.resolve('../scaffold-demoing'), this.config.getAll());
    this.composeWith(require.resolve('../automating'), this.config.getAll());
  }

  default() {
    const { tagName, className } = this.config.getAll();

    // write package.json
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.config.getAll(),
    );

    // write & rename .gitignore
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

    // write & rename element src
    this.fs.copyTpl(
      this.templatePath('MyEl.js'),
      this.destinationPath(`${className}.js`),
      this.config.getAll(),
    );

    // write & rename element definition
    this.fs.copyTpl(
      this.templatePath('my-el.js'),
      this.destinationPath(`${tagName}.js`),
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

  install() {
    this.npmInstall();
  }
};
