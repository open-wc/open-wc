import path from 'path';
import { executeViaOptions } from '../app/executeViaOptions.js';
import { CommonRepoMixin } from '../common-repo/index.js';

/* eslint-disable no-console */
export const AppLitElementMixin = subclass =>
  class extends CommonRepoMixin(subclass) {
    async execute() {
      await super.execute();

      const { tagName, className } = this.templateData;

      // user chosen tag name for app
      const appMainOptions = {
        ...this.options,
        scaffoldType: 'wc-lit-element',
        tagName,
        destinationPath: path.join(process.cwd(), tagName, 'packages', tagName),
        noEnd: true,
      };
      delete appMainOptions.features;

      await executeViaOptions(appMainOptions);

      // page-main
      const pageMainOptions = {
        ...appMainOptions,
        tagName: 'page-main',
        destinationPath: path.join(process.cwd(), tagName, 'packages/page-main/'),
      };

      await executeViaOptions(pageMainOptions);

      // page-one
      const pageOneOptions = {
        ...appMainOptions,
        tagName: 'page-one',
        destinationPath: path.join(process.cwd(), tagName, 'packages/page-one/'),
      };

      await executeViaOptions(pageOneOptions);

      // write & rename el class template
      this.copyTemplate(
        `${__dirname}/templates/_MyApp.js`,
        this.destinationPath(`packages/${tagName}/src/${className}.js`),
      );

      this.copyTemplate(
        `${__dirname}/templates/_open-wc-logo.js`,
        this.destinationPath(`packages/${tagName}/src/open-wc-logo.js`),
      );

      this.copyTemplate(
        `${__dirname}/templates/_templateAbout.js`,
        this.destinationPath(`packages/${tagName}/src/templateAbout.js`),
      );

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);

      if (this.options.features && this.options.features.includes('testing')) {
        this.copyTemplate(
          `${__dirname}/templates/_my-app.test.js`,
          this.destinationPath(`packages/${tagName}/test/${tagName}.test.js`),
        );

        await this.copyTemplates(`${__dirname}/templates/static-testing/**/*`);
      }

      if (this.options.features && this.options.features.includes('demoing')) {
        await this.copyTemplates(`${__dirname}/templates/static-demoing/**/*`);
      }

      if (this.options.scaffoldFilesFor && this.options.scaffoldFilesFor.includes('testing')) {
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
