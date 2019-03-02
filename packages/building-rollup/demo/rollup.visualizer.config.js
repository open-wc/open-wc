import visualizer from 'rollup-plugin-visualizer';
import createDefaultConfig from '../modern-and-legacy-config';

const configs = createDefaultConfig({
  input: './demo/index.html',
});
const config = configs[0];

export default {
  ...config,
  plugins: [
    ...config.plugins,
    visualizer({
      sourcemap: true,
    }),
  ],
};
