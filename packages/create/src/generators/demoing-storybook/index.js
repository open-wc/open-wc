import { askYesNo, askTagInfo } from '../../helpers.js';

const DemoingStorybookMixin = subclass =>
  class extends subclass {
    async execute() {
      await super.execute();

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);

      const wantsScaffolding = await askYesNo('Should we scaffold some story files as well?');
      if (wantsScaffolding) {
        const { tagName, className } = await askTagInfo();
        this.templateData = { ...this.templateData, tagName, className };

        await this.copyTemplates(`${__dirname}/templates/static-scaffold/**/*`);
      }
    }
  };

export default DemoingStorybookMixin;
