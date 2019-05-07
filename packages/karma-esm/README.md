# karma-esm

[//]: # (AUTO INSERT HEADER PREPUBLISH)

Karma plugin for running tests in es modules.

## Usage
See `testing-karma` for an implementation and default configuration.

1. Install the plugin
`npm i --save @open-wc/karma-esm`

2. Add to your karma config
```javascript
{
  // define where your test files are, make sure to set type to module
  files: [
    { pattern: 'test/**/*.test.js' type: 'module' }
  ]

  plugins: [
    // load plugin
    require.resolve('@open-wc/karma-esm'),

    // fallback: resolve any karma- plugins
    'karma-*',
  ],

  frameworks: ['esm'],

  middleware: ['esm'],

  preprocessors: {
    '**/*.test.js': ['esm'],
    '**/*.spec.js': ['esm'],
  },

  esm: {
    // whether you want to profile for test coverage
    coverage: true / false,
    babel: {
      // exclude libraries which don't need babel processing for speed
      exclude: [
        '**/node_modules/sinon/**',
        '**/node_modules/@bundled-es-modules/**',
      ],
    },
  },
}
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/karma-esm/README.md';
      }
    }
  }
</script>
