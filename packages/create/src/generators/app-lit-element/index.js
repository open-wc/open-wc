import { CommonRepoMixin } from '../common-repo/index.js';

/* eslint-disable no-console */
export const AppLitElementMixin = subclass =>
  class extends CommonRepoMixin(subclass) {
    async execute() {
      await super.execute();

      const { tagName, className } = this.templateData;

      // write & rename el class template
      this.copyTemplate(
        `${__dirname}/templates/_aboutTemplate.js`,
        this.destinationPath(`components/${tagName}/aboutTemplate.js`),
      );

      this.copyTemplate(
        `${__dirname}/templates/_my-app.js`,
        this.destinationPath(`components/${tagName}/${tagName}.js`),
      );

      this.copyTemplate(
        `${__dirname}/templates/_MyApp.js`,
        this.destinationPath(`components/${tagName}/${className}.js`),
      );

      this.copyTemplate(
        `${__dirname}/templates/_open-wc-logo.js`,
        this.destinationPath(`components/${tagName}/open-wc-logo.js`),
      );

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);

      this.copyTemplate(
        `${__dirname}/templates/custom-elements.json`,
        this.destinationPath('custom-elements.json'),
      );

      if (this.options.features && this.options.features.includes('testing')) {
        await this.copyTemplates(`${__dirname}/templates/static-testing/**/*`);
      }

      if (this.options.features && this.options.features.includes('demoing')) {
        await this.copyTemplates(`${__dirname}/templates/static-demoing/**/*`);
      }

      if (this.options.scaffoldFilesFor && this.options.scaffoldFilesFor.includes('demoing')) {
        this.copyTemplate(
          `${__dirname}/templates/_my-app.stories.js`,
          this.destinationPath(`components/${tagName}/stories/${tagName}.stories.js`),
        );

        await this.copyTemplates(`${__dirname}/templates/static-scaffold-demoing/**/*`);
      }

      if (this.options.scaffoldFilesFor && this.options.scaffoldFilesFor.includes('testing')) {
        this.copyTemplate(
          `${__dirname}/templates/_my-app.test.js`,
          this.destinationPath(`components/${tagName}/test/${tagName}.test.js`),
        );

        await this.copyTemplates(`${__dirname}/templates/static-scaffold-testing/**/*`);
      }
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
