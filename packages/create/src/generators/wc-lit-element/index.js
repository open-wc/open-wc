/* eslint-disable no-console */
const WcLitElementMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();
      const { tagName, className } = this.templateData;

      // write & rename el class template
      this.copyTemplate(
        `${__dirname}/templates/_MyEl.js`,
        this.destinationPath(`src/${className}.js`),
      );

      // write & rename el registration template
      this.copyTemplate(`${__dirname}/templates/_my-el.js`, this.destinationPath(`${tagName}.js`));

      this.copyTemplate(`${__dirname}/templates/_gitignore`, this.destinationPath(`.gitignore`));

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

export default WcLitElementMixin;
