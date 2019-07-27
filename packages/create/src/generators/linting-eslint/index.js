const LintingEsLintMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );
    }
  };

export default LintingEsLintMixin;
