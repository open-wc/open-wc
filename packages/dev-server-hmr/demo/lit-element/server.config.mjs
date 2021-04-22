import { hmrPlugin, presets } from '../../index.mjs';

export default {
  open: 'packages/dev-server-hmr/demo/lit-element/',
  rootDir: '../..',
  nodeResolve: true,
  plugins: [
    hmrPlugin({
      exclude: ['**/*/node_modules/**/*'],
      presets: [presets.lit],
    }),
  ],
};
