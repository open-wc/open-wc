/* eslint-disable class-methods-use-this, no-console */

const Generator = require('yeoman-generator');

module.exports = class GeneratorStarterApp extends Generator {
  initializing() {
    if (Object.keys(this.config.getAll()).length === 0) {
      this.composeWith(require.resolve('../get-tag-name'), {
        __store: this.config,
      });
    }
  }

  configuring() {
    this.composeWith(require.resolve('../building-webpack'), this.config.getAll());
    this.composeWith(require.resolve('../linting'), this.config.getAll());
    this.composeWith(require.resolve('../testing'), this.config.getAll());
  }

  writing() {
    const { tagName } = this.config.getAll();

    // extend package.json
    this.fs.extendJSON(
      this.destinationPath('package.json'),
      this.fs.readJSON(this.templatePath('_package.json')),
    );

    // write & rename app-template
    this.fs.copyTpl(
      this.templatePath('_app.js'),
      this.destinationPath(`src/${tagName}.js`),
      this.config.getAll(),
    );

    // write & rename test-template
    this.fs.copyTpl(
      this.templatePath('_test.js'),
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

  install() {
    this.npmInstall();
  }

  end() {
    console.log('');
    console.log('You are all set up now!');
    console.log('');
    console.log('All you need to do is run:');
    console.log('  npm run start');
    console.log('');
  }
};
