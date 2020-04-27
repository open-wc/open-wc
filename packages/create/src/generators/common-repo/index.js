export const CommonRepoMixin = subclass =>
  class extends subclass {
    async execute() {
      this.templateData = {
        ...this.templateData,
        year: new Date().getFullYear(),
      };

      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      // write and rename .gitignore
      this.copyTemplate(`${__dirname}/templates/_gitignore`, this.destinationPath(`.gitignore`));

      // copy all other files
      await this.copyTemplates(`${__dirname}/templates/static/**/*`);
    }
  };
