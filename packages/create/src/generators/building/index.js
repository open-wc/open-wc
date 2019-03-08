/* eslint-disable no-console */
import BuildingWebpackMixin from '../building-webpack/index.js';

const BuildingMixin = subclass =>
  class extends BuildingWebpackMixin(subclass) {
    async execute() {
      await super.execute();
      console.log('... Building done');
    }
  };

export default BuildingMixin;
