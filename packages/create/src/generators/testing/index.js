/* eslint-disable max-classes-per-file */
import { TestingWebTestRunnerMixin } from '../testing-wtr/index.js';

export const TestingMixin = subclass =>
  class extends TestingWebTestRunnerMixin(subclass) {
    async execute() {
      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );
    }
  };

export const TestingScaffoldMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();

      const { tagName } = this.templateData;
      this.copyTemplate(
        `${__dirname}/templates/_my-el.test.js`,
        this.destinationPath(`test/${tagName}.test.js`),
      );
    }
  };
