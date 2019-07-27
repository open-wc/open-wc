/* eslint-disable no-console */
import LintingEsLint from '../linting-eslint/index.js';
import LintingPrettierMixin from '../linting-prettier/index.js';

const LintingMixin = subclass =>
  class extends LintingPrettierMixin(LintingEsLint(subclass)) {
    async execute() {
      await super.execute();

      // extend package.json
      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );
    }
  };

export default LintingMixin;
