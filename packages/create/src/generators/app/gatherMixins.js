import { WcLitElementMixin, WcLitElementPackageMixin } from '../wc-lit-element/index.js';
import { LintingMixin } from '../linting/index.js';
import { TestingMixin, TestingScaffoldMixin } from '../testing/index.js';
import {
  DemoingStorybookMixin,
  DemoingStorybookScaffoldMixin,
} from '../demoing-storybook/index.js';
import { BuildingRollupMixin } from '../building-rollup/index.js';
// ts
import { TsWcLitElementMixin, TsWcLitElementPackageMixin } from '../wc-lit-element-ts/index.js';
import { TsLintingMixin } from '../linting-ts/index.js';
import { TsTestingMixin, TsTestingScaffoldMixin } from '../testing-ts/index.js';
import {
  TsDemoingStorybookMixin,
  TsDemoingStorybookScaffoldMixin,
} from '../demoing-storybook-ts/index.js';
import { TsBuildingRollupMixin } from '../building-rollup-ts/index.js';

export function gatherMixins(options) {
  let considerScaffoldFilesFor = false;
  const mixins = [];

  if (options.type === 'scaffold') {
    if (options.typescript === 'true') {
      switch (options.scaffoldType) {
        case 'wc':
          mixins.push(TsWcLitElementPackageMixin);
          considerScaffoldFilesFor = true;
          break;
        case 'wc-lit-element':
          mixins.push(TsWcLitElementMixin);
          considerScaffoldFilesFor = true;
          break;
        // no default
      }
    } else {
      switch (options.scaffoldType) {
        case 'wc':
          mixins.push(WcLitElementPackageMixin);
          considerScaffoldFilesFor = true;
          break;
        case 'wc-lit-element':
          mixins.push(WcLitElementMixin);
          considerScaffoldFilesFor = true;
          break;
        // no default
      }
    }
  }

  if (options.features && options.features.length > 0) {
    if (options.typescript === 'true') {
      options.features.forEach(feature => {
        if (feature === 'linting') {
          mixins.push(TsLintingMixin);
        }
        if (feature === 'testing') {
          mixins.push(TsTestingMixin);
        }
        if (feature === 'demoing') {
          mixins.push(TsDemoingStorybookMixin);
        }
        if (feature === 'building') {
          mixins.push(TsBuildingRollupMixin);
        }
      });
    } else {
      options.features.forEach(feature => {
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
          mixins.push(BuildingRollupMixin);
        }
      });
    }
  }

  if (considerScaffoldFilesFor && options.scaffoldFilesFor && options.scaffoldFilesFor.length > 0) {
    options.scaffoldFilesFor.forEach(feature => {
      if (options.typescript === 'true') {
        switch (feature) {
          case 'testing':
            mixins.push(TsTestingScaffoldMixin);
            break;
          case 'demoing':
            mixins.push(TsDemoingStorybookScaffoldMixin);
            break;
          // no default
        }
      } else {
        switch (feature) {
          case 'testing':
            mixins.push(TestingScaffoldMixin);
            break;
          case 'demoing':
            mixins.push(DemoingStorybookScaffoldMixin);
            break;
          // no default
        }
      }
    });
  }

  return mixins;
}
