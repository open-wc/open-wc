import { storybookPlugin } from '@web/dev-server-storybook';
import * as mdjsModule from '../../index.js';

const { mdjsToCsf } = mdjsModule;

export default {
  rootDir: '../..',
  open: true,
  nodeResolve: true,
  plugins: [
    {
      resolveMimeType(context) {
        if (context.path.endsWith('.md')) {
          return 'js';
        }
      },
      async transform(context) {
        if (context.path.endsWith('.md')) {
          context.body = await mdjsToCsf(context.body, context.path, 'web-components');
        }
      },
    },
    storybookPlugin({ type: 'web-components', configDir: 'demo/.storybook' }),
  ],
};
