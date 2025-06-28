/**
 * @fileoverview linting plugin for lit-a11y
 * @author open-wc
 */
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import * as rules from './rules/index.js';
import pkgJson from '../package.json' with { type: 'json' };

// Recommended rule configuration
const recommendedRules = {
  'lit-a11y/accessible-emoji': 'off',
  'lit-a11y/accessible-name': 'error',
  'lit-a11y/alt-text': 'error',
  'lit-a11y/anchor-is-valid': 'error',
  'lit-a11y/aria-activedescendant-has-tabindex': 'error',
  'lit-a11y/aria-attr-valid-value': 'error',
  'lit-a11y/aria-attrs': 'error',
  'lit-a11y/aria-role': 'error',
  'lit-a11y/aria-unsupported-elements': 'error',
  'lit-a11y/autocomplete-valid': 'error',
  'lit-a11y/click-events-have-key-events': 'error',
  'lit-a11y/definition-list': 'error',
  'lit-a11y/heading-hidden': 'error',
  'lit-a11y/iframe-title': 'error',
  'lit-a11y/img-redundant-alt': 'error',
  'lit-a11y/list': 'error',
  'lit-a11y/mouse-events-have-key-events': 'error',
  'lit-a11y/no-access-key': 'error',
  'lit-a11y/no-aria-slot': 'error',
  'lit-a11y/no-autofocus': 'error',
  'lit-a11y/no-distracting-elements': 'error',
  'lit-a11y/no-invalid-change-handler': 'off',
  'lit-a11y/no-redundant-role': 'error',
  'lit-a11y/obj-alt': 'error',
  'lit-a11y/role-has-required-aria-attrs': 'error',
  'lit-a11y/role-supports-aria-attr': 'error',
  'lit-a11y/scope': 'error',
  'lit-a11y/tabindex-no-positive': 'error',
  'lit-a11y/valid-lang': 'off',
};

const plugin = {
  meta: {
    name: pkgJson.name,
    version: pkgJson.version,
  },
  processors: {},
  rules: {
    'accessible-emoji': rules.accessibleEmoji,
    'accessible-name': rules.accessibleName,
    'alt-text': rules.altText,
    'anchor-is-valid': rules.anchorIsValid,
    'aria-activedescendant-has-tabindex': rules.ariaActivedescendantHasTabindex,
    'aria-attr-valid-value': rules.ariaAttrValidValue,
    'aria-attrs': rules.ariaAttrs,
    'aria-role': rules.ariaRole,
    'aria-unsupported-elements': rules.ariaUnsupportedElements,
    'autocomplete-valid': rules.autocompleteValid,
    'click-events-have-key-events': rules.clickEventsHaveKeyEvents,
    'definition-list': rules.definitionList,
    'heading-hidden': rules.headingHidden,
    'iframe-title': rules.iframeTitle,
    'img-redundant-alt': rules.imgRedundantAlt,
    list: rules.list,
    'mouse-events-have-key-events': rules.mouseEventsHaveKeyEvents,
    'no-access-key': rules.noAccessKey,
    'no-aria-slot': rules.noAriaSlot,
    'no-autofocus': rules.noAutofocus,
    'no-distracting-elements': rules.noDistractingElements,
    'no-invalid-change-handler': rules.noInvalidChangeHandler,
    'no-redundant-role': rules.noRedundantRole,
    'obj-alt': rules.objAlt,
    'role-has-required-aria-attrs': rules.roleHasRequiredAriaAttrs,
    'role-supports-aria-attr': rules.roleSupportsAriaAttr,
    scope: rules.scope,
    'tabindex-no-positive': rules.tabindexNoPositive,
    'valid-lang': rules.validLang,
  },
  configs: {},
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
  recommended: {
    plugins: {
      'lit-a11y': plugin,
    },
    rules: {
      ...recommendedRules,
    },
  },
});

export default plugin;

export { rules, recommendedRules };

// For backwards compatibility with CommonJS
export const configs = plugin.configs;
export const flatConfigs = plugin.flatConfigs;
