const LintingPrettierMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      this.copyTemplate(
        `${__dirname}/templates/_prettier.config.js`,
        this.destinationPath('prettier.config.js'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);
    }
  };

export default LintingPrettierMixin;
