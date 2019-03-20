/* eslint-disable no-console */
import BuildingRollupMixin from '../building-rollup/index.js';

const BuildingMixin = subclass =>
  class extends BuildingRollupMixin(subclass) {
    async execute() {
      await super.execute();
      console.log('... Building done');
    }
  };

export default BuildingMixin;
