/* eslint-disable no-console */
import LintingMixin from '../linting/index.js';
import TestingMixin from '../testing/index.js';
import BuildingRollupMixin from '../building-rollup/index.js';

const StarterAppMixin = subclass =>
  class extends BuildingRollupMixin(TestingMixin(LintingMixin(subclass))) {
    async execute() {
      await super.execute();
      const { tagName } = this.templateData;

      // write & rename app-template
      this.copyTemplate(
        `${__dirname}/templates/_app.js`,
        this.destinationPath(`src/${tagName}.js`),
      );

      // write & rename test-template
      this.copyTemplate(
        `${__dirname}/templates/_test.js`,
        this.destinationPath(`test/${tagName}.test.js`),
      );

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

export default StarterAppMixin;
