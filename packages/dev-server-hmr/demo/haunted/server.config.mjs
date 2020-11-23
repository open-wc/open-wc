import { hmrPlugin, presets } from '../../index.mjs';

export default {
  open: 'packages/dev-server-hmr/demo/haunted/',
  rootDir: '../..',
  nodeResolve: true,
  plugins: [
    hmrPlugin({
      exclude: ['**/*/node_modules/**/*'],
      functions: [{ name: 'component', import: 'haunted' }],
    }),
  ],
};
