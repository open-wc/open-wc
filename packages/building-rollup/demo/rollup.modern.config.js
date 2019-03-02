import copy from 'rollup-plugin-copier';
import createDefaultConfig from '../modern-config';

const config = createDefaultConfig({
  input: './demo/index.html',
});

export default {
  ...config,
  plugins: [
    ...config.plugins,
    copy({
      items: [
        {
          src: 'demo/a/b/foo.txt',
          dest: 'dist/demo/a/b/foo.txt',
          createPath: true,
        },
      ],
    }),
  ],
};
