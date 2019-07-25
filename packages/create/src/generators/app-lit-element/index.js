/* eslint-disable no-console */
const AppLitElementMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();

      const { tagName, className } = this.templateData;

      // write & rename el class template
      this.copyTemplate(
        `${__dirname}/templates/_MyApp.js`,
        this.destinationPath(`src/${className}.js`),
      );

      // write & rename el registration template
      this.copyTemplate(`${__dirname}/templates/_my-app.js`, this.destinationPath(`${tagName}.js`));

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);
    }

    async end() {
      await super.end();
      console.log('');
      console.log('You are all set up now!');
      console.log('');
      console.log('All you need to do is run:');
      console.log(`  cd ${this.templateData.tagName}`);
      console.log('  npm run start');
      console.log('');
    }
  };

export default AppLitElementMixin;
