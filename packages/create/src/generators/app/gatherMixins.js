import { WcLitElementMixin, WcLitElementPackageMixin } from '../wc-lit-element/index.js';
import { LintingMixin } from '../linting/index.js';
import { TestingMixin, TestingScaffoldMixin } from '../testing/index.js';
import {
  DemoingStorybookMixin,
  DemoingStorybookScaffoldMixin,
} from '../demoing-storybook/index.js';
import { BuildingRollupMixin } from '../building-rollup/index.js';
import { BuildingWebpackMixin } from '../building-webpack/index.js';

export function gatherMixins(options) {
  let considerScaffoldFilesFor = false;
  const mixins = [];
  if (options.type === 'scaffold') {
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

  if (options.features && options.features.length > 0) {
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
        switch (options.buildingType) {
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

  if (considerScaffoldFilesFor && options.scaffoldFilesFor && options.scaffoldFilesFor.length > 0) {
    options.scaffoldFilesFor.forEach(feature => {
      switch (feature) {
        case 'testing':
          mixins.push(TestingScaffoldMixin);
          break;
        case 'demoing':
          mixins.push(DemoingStorybookScaffoldMixin);
          break;
        // no default
      }
    });
  }

  return mixins;
}
