export const TsLintingEsLintMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      this.copyTemplate(
        `${__dirname}/templates/_.eslintrc.js`,
        this.destinationPath('.eslintrc.js'),
      );
    }
  };
