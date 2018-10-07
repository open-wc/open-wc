const Generator = require('yeoman-generator');

module.exports = class GeneratorVanilla extends Generator {
  initializing() {
    this.composeWith(require.resolve('../get-tag-name'), {
      __store: this.config,
    });
  }

  default() {
    this.composeWith(require.resolve('../vanilla-bare'), this.config.getAll());
    this.composeWith(require.resolve('../lint-eslint'), this.config.getAll());
    this.composeWith(require.resolve('../publish-storybook'), this.config.getAll());
    // this.composeWith(require.resolve('../publish-vuepress'), this.config.getAll());
    this.composeWith(require.resolve('../testing-bare'), this.config.getAll());
    this.composeWith(require.resolve('../testing-karma'), this.config.getAll());
    this.composeWith(require.resolve('../testing-karma-bs'), this.config.getAll());
    this.composeWith(require.resolve('../tools-circleci'), this.config.getAll());
    // this.composeWith(require.resolve('../tools-renovate'), this.config.getAll());
  }
};
