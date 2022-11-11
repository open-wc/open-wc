import { esbuildPlugin } from '@web/dev-server-esbuild';
import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

export default {
  open: 'packages/dev-server-hmr/demo/lit-element-ts/',
  rootDir: '../..',
  nodeResolve: true,
  plugins: [
    esbuildPlugin({ ts: true }),
    hmrPlugin({
      exclude: ['**/*/node_modules/**/*'],
      presets: [presets.lit],
    }),
  ],
};
