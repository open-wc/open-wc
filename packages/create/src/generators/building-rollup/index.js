import { askTagInfo } from '../../helpers.js';

const BuildingRollupMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();

      const { tagName, className } = await askTagInfo();
      this.templateData = { ...this.templateData, tagName, className };

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);
    }
  };

export default BuildingRollupMixin;
