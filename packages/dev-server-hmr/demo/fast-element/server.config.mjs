import { esbuildPlugin } from '@web/dev-server-esbuild';
import { hmrPlugin, presets } from '../../index.mjs';

export default {
  open: 'packages/dev-server-hmr/demo/fast-element/',
  rootDir: '../..',
  nodeResolve: true,
  plugins: [
    esbuildPlugin({ ts: true }),
    hmrPlugin({
      exclude: ['**/*/node_modules/**/*'],
      presets: [presets.fastElement],
    }),
  ],
};
