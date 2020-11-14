const packages = [
  { name: 'polyfills-loader', type: 'js', environment: 'node' },
  { name: 'dev-server-hmr', type: 'js', environment: 'node', strict: true },
  { name: 'import-maps-resolve', type: 'js', environment: 'node' },
  { name: 'scoped-elements', type: 'js', environment: 'browser' },
  { name: 'testing-helpers', type: 'js', environment: 'browser' },
  { name: 'mdjs', type: 'js', environment: 'node' },
];

export { packages };
