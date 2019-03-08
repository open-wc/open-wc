import cpy from 'rollup-plugin-cpy';
import createDefaultConfig from '../../modern-and-legacy-config';

const config = createDefaultConfig({
  input: './demo/js/index.html',
});

export default [
  {
    ...config[0],
    plugins: [
      ...config[0].plugins,
      cpy({
        files: ['**/*.txt'],
        dest: 'dist',
        options: {
          parents: true,
        },
      }),
    ],
  },
  config[1],
];
