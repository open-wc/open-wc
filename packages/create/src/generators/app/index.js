/* eslint-disable no-console */
import prompts from 'prompts';
import commandLineArgs from 'command-line-args';
import { executeMixinGenerator } from '../../core.js';
import { AppLitElementMixin } from '../app-lit-element/index.js';

import header from './header.js';
import { gatherMixins } from './gatherMixins.js';

/**
 * Allows to control the data via command line
 *
 * example:
 * npm init @open-wc --type scaffold --scaffoldType app --tagName foo-bar --installDependencies false
 * npm init @open-wc --type upgrade --features linting demoing --tagName foo-bar --scaffoldFilesFor demoing --installDependencies false
 */
const optionDefinitions = [
  { name: 'destinationPath', type: String }, // path
  { name: 'type', type: String }, // scaffold, upgrade
  { name: 'scaffoldType', type: String }, // wc, app
  { name: 'features', type: String, multiple: true }, // linting, testing, demoing, building
  { name: 'buildingType', type: String }, // rollup, webpack
  { name: 'scaffoldFilesFor', type: String, multiple: true }, // testing, demoing, building
  { name: 'tagName', type: String },
  { name: 'installDependencies', type: String }, // yarn, npm, false
  { name: 'writeToDisk', type: String }, // true, false
];
const overrides = commandLineArgs(optionDefinitions);
prompts.override(overrides);

export const AppMixin = subclass =>
  // eslint-disable-next-line no-shadow
  class AppMixin extends subclass {
    constructor() {
      super();
      this.wantsNpmInstall = false;
      this.wantsWriteToDisk = false;
      this.wantsRecreateInfo = false;
    }

    async execute() {
      console.log(header);
      const scaffoldOptions = [];
      const questions = [
        {
          type: 'select',
          name: 'type',
          message: 'What would you like to do today?',
          choices: [
            { title: 'Scaffold a new project', value: 'scaffold' },
            { title: 'Upgrade an existing project', value: 'upgrade' },
          ],
        },
        {
          type: (prev, all) => (all.type === 'scaffold' ? 'select' : null),
          name: 'scaffoldType',
          message: 'What would you like to scaffold?',
          choices: [
            { title: 'Web Component', value: 'wc' },
            { title: 'Application', value: 'app' },
          ],
        },
        {
          type: (prev, all) =>
            all.scaffoldType === 'wc' || all.scaffoldType === 'app' || all.type === 'upgrade'
              ? 'multiselect'
              : null,
          name: 'features',
          message: 'What would you like to add?',
          choices: (prev, all) =>
            [
              { title: 'Linting (eslint & prettier)', value: 'linting' },
              { title: 'Testing (karma)', value: 'testing' },
              { title: 'Demoing (storybook)', value: 'demoing' },
              all.scaffoldType !== 'wc' && {
                title: 'Building (rollup or webpack)',
                value: 'building',
              },
            ].filter(_ => !!_),
          onState: state => {
            state.value.forEach(meta => {
              if (meta.selected === true && meta.value !== 'linting') {
                scaffoldOptions.push({
                  title: meta.title,
                  value: meta.value,
                });
              }
            });
          },
        },
        {
          type: (prev, all) =>
            all.features && all.features.includes('building') ? 'select' : null,
          name: 'buildingType',
          message: 'What would you like to use for Building?',
          choices: [
            { title: 'Rollup (recommended)', value: 'rollup' },
            { title: 'Webpack', value: 'webpack' },
          ],
        },
        {
          type: () => (scaffoldOptions.length > 0 ? 'multiselect' : null),
          name: 'scaffoldFilesFor',
          message: 'Would you like to scaffold examples files for?',
          choices: scaffoldOptions,
        },
        {
          type: 'text',
          name: 'tagName',
          message: 'What is the tag name of your application/web component?',
          validate: tagName =>
            !/^([a-z])(?!.*[<>])(?=.*-).+$/.test(tagName)
              ? 'You need a minimum of two words separated by dashes (e.g. foo-bar)'
              : true,
        },
      ];

      /**
       * {
       *   type: 'scaffold',
       *   scaffoldType: 'wc',
       *   features: [ 'testing', 'building' ],
       *   buildingType: 'rollup',
       *   scaffoldFilesFor: [ 'testing' ],
       *   tagName: 'foo-bar',
       *   installDependencies: 'false'
       * }
       */
      this.options = await prompts(questions, {
        onCancel: () => {
          process.exit();
        },
      });

      const mixins = gatherMixins(this.options);
      // app is separate to prevent circular imports
      if (this.options.type === 'scaffold' && this.options.scaffoldType === 'app') {
        mixins.push(AppLitElementMixin);
      }
      await executeMixinGenerator(mixins, this.options);
    }
  };

export default AppMixin;
