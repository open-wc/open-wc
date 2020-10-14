/**
 * @fileoverview linting plugin for lit-a11y
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(`${__dirname}/rules`);

module.exports.configs = {
  recommended: {
    plugins: ['lit-ally'],
    rules: {
      'lit-ally/accessible-emoji': 'error',
      'lit-ally/alt-text': 'error',
      'lit-ally/anchor-has-content': 'error',
      'lit-ally/anchor-is-valid': 'error',
      'lit-ally/aria-activedescendant-has-tabindex': 'error',
      'lit-ally/aria-attr-valid-value': 'error',
      'lit-ally/aria-attrs': 'error',
      'lit-ally/aria-role': 'error',
      'lit-ally/aria-unsupported-elements': 'error',
      'lit-ally/autocomplete-valid': 'error',
      'lit-ally/click-events-have-key-events': 'warn',
      'lit-ally/heading-has-content': 'error',
      'lit-ally/iframe-title': 'error',
      'lit-ally/img-redundant-alt': 'error',
      'lit-ally/mouse-events-have-key-events': 'error',
      'lit-ally/no-access-key': 'error',
      'lit-ally/no-autofocus': 'error',
      'lit-ally/no-distracting-elements': 'error',
      'lit-ally/no-invalid-change-handler': 'error',
      'lit-ally/no-redundant-role': 'error',
      'lit-ally/role-has-required-aria-attrs': 'error',
      'lit-ally/role-supports-aria-attr': 'error',
      'lit-ally/scope': 'error',
      'lit-ally/tabindex-no-positive': 'error',
    },
  },
};
