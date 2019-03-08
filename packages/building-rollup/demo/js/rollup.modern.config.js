import cpy from 'rollup-plugin-cpy';
import createDefaultConfig from '../../modern-config';

const config = createDefaultConfig({
  input: './demo/js/index.html',
});

export default {
  ...config,
  plugins: [
    ...config.plugins,
    cpy({
      files: ['**/*.txt'],
      dest: 'dist',
      options: {
        parents: true,
      },
    }),
  ],
};
