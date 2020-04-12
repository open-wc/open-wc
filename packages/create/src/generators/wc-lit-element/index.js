/* eslint-disable max-classes-per-file */
import { join } from 'path';
import { CommonRepoMixin } from '../common-repo/index.js';
import { processTemplate, readFileFromPath } from '../../core.js';

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
const safeReduce = (f, initial) => xs => (Array.isArray(xs) ? xs.reduce(f, initial) : xs);

const getTemplatePart = compose(processTemplate, readFileFromPath);

function featureReadmeBlurb(feature) {
  const path = join(__dirname, `./templates/partials/README.${feature}.md`);
  return getTemplatePart(path);
}

function featureReadme(acc, feature, i, a) {
  return `${acc + featureReadmeBlurb(feature)}${i === a.length - 1 ? '' : '\n'}`;
}

const safeFeatureReadme = safeReduce(featureReadme, '');

/* eslint-disable no-console */
export const WcLitElementMixin = subclass =>
  class extends subclass {
    async execute() {
      this.templateData.featureReadmes = safeFeatureReadme(this.options.features);
      this.templateData.scriptRunCommand =
        this.options.installDependencies === 'yarn' ? 'yarn' : 'npm run';

      await super.execute();
      const { tagName, className } = this.templateData;

      // write & rename el class template
      this.copyTemplate(
        `${__dirname}/templates/_MyEl.js`,
        this.destinationPath(`src/${className}.js`),
      );

      // write & rename el registration template
      this.copyTemplate(`${__dirname}/templates/_my-el.js`, this.destinationPath(`${tagName}.js`));

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);
    }
  };

export const WcLitElementPackageMixin = subclass =>
  class extends CommonRepoMixin(WcLitElementMixin(subclass)) {
    async execute() {
      await super.execute();
      // write & rename package.json
      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );
      this.copyTemplate(
        `${__dirname}/templates/custom-elements.json`,
        this.destinationPath('custom-elements.json'),
      );
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
