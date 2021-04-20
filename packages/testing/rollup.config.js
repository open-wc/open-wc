import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const plugins = ['sinon-chai', 'chai-dom'];

export default plugins.map(plugin => ({
  input: plugin,
  output: {
    dir: 'plugins',
  },
  plugins: [resolve(), commonjs()],
}));
