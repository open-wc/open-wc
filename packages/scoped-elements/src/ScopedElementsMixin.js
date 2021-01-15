import { getGlobalRegistryMixinImplementation } from './getGlobalRegistryMixinImplementation.js';
import { getScopedRegistriesMixinImplementation } from './getScopedRegistriesMixinImplementation.js';

// TODO: we probably need to check also the lit-html version to ensure it's compatible
const scopedRegistriesSupported =
  typeof ShadowRoot !== 'undefined' &&
  // @ts-expect-error: importNode not yet in ts lib
  ShadowRoot.prototype.importNode !== undefined;

export const ScopedElementsMixin = scopedRegistriesSupported
  ? getScopedRegistriesMixinImplementation()
  : getGlobalRegistryMixinImplementation();
