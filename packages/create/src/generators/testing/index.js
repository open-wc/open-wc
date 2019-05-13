import TestingKarmaMixin from '../testing-karma/index.js';
import TestingKarmaBsMixin from '../testing-karma-bs/index.js';

const TestingMixin = subclass =>
  class extends TestingKarmaBsMixin(TestingKarmaMixin(subclass)) {
    async execute() {
      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      if (this.options.scaffoldFilesFor && this.options.scaffoldFilesFor.includes('testing')) {
        const { tagName } = this.templateData;
        this.copyTemplate(
          `${__dirname}/templates/_my-el.test.js`,
          this.destinationPath(`test/${tagName}.test.js`),
        );
      }
    }
  };

export default TestingMixin;
