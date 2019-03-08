/* eslint-disable no-console */
import path from 'path';
import { askTagInfo } from '../../helpers';

const BareboneAppMixin = subclass =>
  class extends subclass {
    async execute() {
      // before super to also affect the Mixin it applies
      const { tagName, className } = await askTagInfo();
      this.templateData = { ...this.templateData, tagName, className };
      this._destinationPath = path.join(process.cwd(), tagName);

      console.log('Setup Barebone App...');
      await super.execute();

      // write & rename app-template
      this.copyTemplate(
        `${__dirname}/templates/_app.js`,
        this.destinationPath(`src/${tagName}.js`),
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

export default BareboneAppMixin;
