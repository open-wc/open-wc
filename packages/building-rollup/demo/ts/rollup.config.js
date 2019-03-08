import typescript from 'rollup-plugin-typescript2';
import createDefaultConfig from '../../modern-and-legacy-config';

const configs = createDefaultConfig({
  input: './demo/ts/index.html',
});

export default configs.map(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    typescript({
      tsconfig: './demo/ts/tsconfig.json',
    }),
  ],
}));
