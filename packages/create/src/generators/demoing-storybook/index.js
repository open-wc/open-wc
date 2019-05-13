const DemoingStorybookMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);

      if (this.options.scaffoldFilesFor && this.options.scaffoldFilesFor.includes('demoing')) {
        await this.copyTemplates(`${__dirname}/templates/static-scaffold/**/*`);
      }
    }
  };

export default DemoingStorybookMixin;
