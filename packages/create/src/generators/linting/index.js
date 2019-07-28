/* eslint-disable no-console */
import { LintingEsLintMixin } from '../linting-eslint/index.js';
import { LintingPrettierMixin } from '../linting-prettier/index.js';

export const LintingMixin = subclass =>
  class extends LintingPrettierMixin(LintingEsLintMixin(subclass)) {
    async execute() {
      await super.execute();

      // extend package.json
      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );
    }
  };
