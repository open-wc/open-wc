import { executeMixinGenerator } from '../../core.js';
import { gatherMixins } from './gatherMixins.js';

export async function executeViaOptions(options) {
  const mixins = gatherMixins(options);

  await executeMixinGenerator(mixins, options);
}
