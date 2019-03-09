/* eslint-disable no-console */
import TestingKarmaMixin from '../testing-karma/index.js';
import TestingKarmaBsMixin from '../testing-karma-bs/index.js';
import { askYesNo, askTagInfo, cliOptions } from '../../helpers.js';

const TestingMixin = subclass =>
  class extends TestingKarmaBsMixin(TestingKarmaMixin(subclass)) {
    async execute() {
      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      let wantsScaffolding;
      if (!cliOptions['no-scaffold']) {
        wantsScaffolding = await askYesNo('Should we scaffold some test files as well?');
      } else {
        wantsScaffolding = cliOptions['no-scaffold'];
      }

      if (wantsScaffolding) {
        const { tagName, className } = await askTagInfo();
        this.templateData = { ...this.templateData, tagName, className };

        this.copyTemplate(
          `${__dirname}/templates/_my-el.test.js`,
          this.destinationPath(`test/${tagName}.test.js`),
        );

        await this.copyTemplates(`${__dirname}/templates/static-scaffold/**/*`);
      }

      console.log('... Testing Done');
    }
  };

export default TestingMixin;
