/* eslint-disable no-console */
import LintingEsLint from '../linting-eslint/index.js';
import LintingPrettierMixin from '../linting-prettier/index.js';
import LintingCommitlintMixin from '../linting-commitlint/index.js';

const LintingMixin = subclass =>
  class extends LintingCommitlintMixin(LintingPrettierMixin(LintingEsLint(subclass))) {
    async execute() {
      await super.execute();

      // extend package.json
      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      // write everything else
      await this.copyTemplates(`${__dirname}/templates/static/**/*`);

      console.log('... Linting done');
    }
  };

export default LintingMixin;
