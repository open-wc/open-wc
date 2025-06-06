/**
 * @fileoverview linting plugin for lit-a11y
 * @author open-wc
 */
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgJson = JSON.parse(await readFile(join(__dirname, '../package.json')));

/**
 * @import { RuleDefinition } from "@eslint/core";
 */

async function loadRules() {
  const rulesDir = join(__dirname, 'rules');
  const files = await readdir(rulesDir);
  /** @type {Record<string, RuleDefinition>} */
  const rules = {};

  for (const file of files) {
    if (file.endsWith('.js')) {
      const ruleName = file.replace('.js', '');
      const ruleModule = await import(`./rules/${file}`);
      rules[ruleName] = ruleModule.default;
    }
  }

  return rules;
}

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// Rule definitions
const rules = await loadRules();

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
  rules,
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
