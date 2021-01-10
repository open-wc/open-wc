import { storybookPlugin } from '@web/dev-server-storybook';
import { hmrPlugin, presets } from '../../index.mjs';

export default {
  open: '/',
  rootDir: '../..',
  nodeResolve: true,
  plugins: [
    storybookPlugin({
      type: 'web-components',
      configDir: 'demo/storybook/.storybook',
    }),
    hmrPlugin({
      exclude: ['**/*/node_modules/**/*'],
      presets: [presets.litElement],
    }),
  ],
};
