import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import modernWeb from './plugins/rollup-plugin-modern-web/rollup-plugin-modern-web.js';

const production = !process.env.ROLLUP_WATCH;

export default function createBasicConfig(_options) {
  const options = {
    outputDir: 'dist',
    ..._options,
  };

  return {
    input: options.input,
    treeshake: !!production,
    output: {
      dir: options.outputDir,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      modernWeb(),
      resolve(),
      babel({
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-syntax-import-meta',
          // rollup rewrites import.meta.url, but makes them point to the file location after bundling
          // we want the location before bundling
          'bundled-import-meta',
        ],
        presets: [
          [
            '@babel/env',
            {
              targets: [
                'last 2 Chrome major versions',
                'last 2 ChromeAndroid major versions',
                'last 2 Edge major versions',
                'last 2 Firefox major versions',
                'last 2 Safari major versions',
                'last 2 iOS major versions',
              ],
              useBuiltIns: false,
            },
          ],
        ],
      }),
      production && terser(),
    ],
  };
}
