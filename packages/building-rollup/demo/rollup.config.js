import copy from 'rollup-plugin-copier';
import createDefaultConfig from '../modern-and-legacy-config';

const config = createDefaultConfig({
  input: './demo/index.html',
});

export default [
  {
    ...config[0],
    plugins: [
      ...config[0].plugins,
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
  },
  config[1],
];
