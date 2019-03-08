/* eslint-disable no-console */
import DemoingStorybookMixin from '../demoing-storybook/index.js';

const DemoingMixin = subclass =>
  class extends DemoingStorybookMixin(subclass) {
    async execute() {
      await super.execute();
      console.log('... Demoing done');
    }
  };

export default DemoingMixin;
