module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'].map(require.resolve),
  plugins: ['lit'],
  rules: {
    'lit/no-duplicate-template-bindings': 'error',
    'lit/no-legacy-template-syntax': 'error',
    'lit/no-template-bind': 'error',
    'lit/no-template-map': 'error',
    'lit/no-useless-template-literals': 'error',
    'lit/attribute-value-entities': 'error',
    'lit/binding-positions': 'error',
    'lit/no-property-change-update': 'error',
    'lit/no-invalid-html': 'error',
  },
};
