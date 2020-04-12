/* eslint-disable max-classes-per-file */
export const DemoingStorybookMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);
    }
  };

export const DemoingStorybookScaffoldMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();
      await this.copyTemplates(`${__dirname}/templates/static-scaffold/**/*`);
    }
  };
