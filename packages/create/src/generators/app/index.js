/* eslint-disable no-console */
import qoa from 'qoa';
import { executeMixinGenerator } from '../../core.js';
import LintingMixin from '../linting';
import TestingMixin from '../testing/index.js';
import DemoingMixin from '../demoing/index.js';
import BuildingMixin from '../building/index.js';
import StarterAppMixin from '../starter-app/index.js';
import BareboneAppMixin from '../barebone-app/index.js';
import WcLitElementMixin from '../wc-lit-element/index.js';

const AppMixin = subclass =>
  // eslint-disable-next-line no-shadow
  class AppMixin extends subclass {
    constructor() {
      super();
      this.wantsNpmInstall = false;
    }

    async execute() {
      const { rootMenu } = await qoa.prompt([
        {
          type: 'interactive',
          query: 'What would you like to do today?',
          handle: 'rootMenu',
          symbol: '>',
          menu: [
            'Scaffold a new project',
            'Upgrade an existing project',
            'Nah, I am fine thanks! => exit',
          ],
        },
      ]);
      if (rootMenu === 'Scaffold a new project') {
        await this._promptScaffold();
      }
      if (rootMenu === 'Upgrade an existing project') {
        await this._promptUpgrade();
      }
    }

    // eslint-disable-next-line class-methods-use-this
    async _promptScaffold() {
      const { scaffold } = await qoa.prompt([
        {
          type: 'interactive',
          query: 'What would you like to scaffold?\n You can read more abbout your options here : https://open-wc.org/developing/create.html#usage\nNote: Content will be written in a new folder. ',
          handle: 'scaffold',
          symbol: '>',
          menu: [
            'Barebone App',
            'Starter App',
            'Enterprise App (if you feel lost use the Starter App first)',
            'Lit Element Web Component',
            'Mono Repo for web components',
          ],
        },
      ]);
      switch (scaffold) {
        case 'Barebone App':
          await executeMixinGenerator(BareboneAppMixin);
          break;
        case 'Starter App':
          await executeMixinGenerator(StarterAppMixin);
          break;
        case 'Lit Element Web Component':
          await executeMixinGenerator(WcLitElementMixin);
          break;
        default:
          console.log('Sorry not yet implemented - visit us on https://github.com/open-wc/open-wc');
      }
    }

    // eslint-disable-next-line class-methods-use-this
    async _promptUpgrade() {
      const { upgrade } = await qoa.prompt([
        {
          type: 'interactive',
          query:
            'What would you like to upgrade?\nNote: Files will be written to the current folder (existing files will be overwritten)',
          handle: 'upgrade',
          symbol: '>',
          menu: ['Linting', 'Testing', 'Demoing', 'Building'],
        },
      ]);
      switch (upgrade) {
        case 'Linting':
          await executeMixinGenerator(LintingMixin);
          break;
        case 'Testing':
          await executeMixinGenerator(TestingMixin);
          break;
        case 'Demoing':
          await executeMixinGenerator(DemoingMixin);
          break;
        case 'Building':
          await executeMixinGenerator(BuildingMixin);
          break;
        default:
      }
    }
  };

export default AppMixin;
