/* eslint-disable no-console */
import prompts from 'prompts';
import commandLineArgs from 'command-line-args';
import { executeMixinGenerator } from '../../core.js';
import LintingMixin from '../linting';
import TestingMixin from '../testing/index.js';
import DemoingStorybookMixin from '../demoing-storybook/index.js';
import BuildingRollupMixin from '../building-rollup/index.js';
import BuildingWebpackMixin from '../building-webpack/index.js';
import StarterAppMixin from '../starter-app/index.js';
import BareboneAppMixin from '../barebone-app/index.js';
import WcLitElementMixin from '../wc-lit-element/index.js';

import header from './header.js';

/**
 * Allows to control the data via command line
 *
 * example:
 * npm init @open-wc --type scaffold --scaffoldType starter-app --tagName foo-bar --installDependencies false
 * npm init @open-wc --type upgrade --features linting demoing --tagName foo-bar --scaffoldFilesFor demoing --installDependencies false
 */
const optionDefinitions = [
  { name: 'type', type: String }, // scaffold, upgrade
  { name: 'scaffoldType', type: String }, // wc, app, starter-app
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
            { title: 'Basic Application   (barebone)', value: 'app' },
            { title: 'Starter App         (linting/testing/building)', value: 'starter-app' },
          ],
        },
        {
          type: (prev, all) =>
            all.scaffoldType === 'wc' || all.scaffoldType === 'app' || all.type === 'upgrade'
              ? 'multiselect'
              : null,
          name: 'features',
          message: 'What would you like to add?',
          choices: [
            { title: 'Linting', value: 'linting' },
            { title: 'Testing', value: 'testing' },
            { title: 'Demoing', value: 'demoing' },
            { title: 'Building', value: 'building' },
          ],
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

      const mixins = [];
      if (this.options.type === 'scaffold') {
        switch (this.options.scaffoldType) {
          case 'wc':
            mixins.push(WcLitElementMixin);
            break;
          case 'app':
            mixins.push(BareboneAppMixin);
            break;
          case 'starter-app':
            mixins.push(StarterAppMixin);
            break;
          // no default
        }
      }

      if (this.options.features && this.options.features.length > 0) {
        this.options.features.forEach(feature => {
          if (feature === 'linting') {
            mixins.push(LintingMixin);
          }
          if (feature === 'testing') {
            mixins.push(TestingMixin);
          }
          if (feature === 'demoing') {
            mixins.push(DemoingStorybookMixin);
          }
          if (feature === 'building') {
            switch (this.options.buildingType) {
              case 'rollup':
                mixins.push(BuildingRollupMixin);
                break;
              case 'webpack':
                mixins.push(BuildingWebpackMixin);
                break;
              // no default
            }
          }
        });
      }

      await executeMixinGenerator(mixins, this.options);
    }
  };

export default AppMixin;
