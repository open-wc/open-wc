import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import dynamicImportPolyfill from './plugins/rollup-plugin-dynamic-import-polyfill';

const production = !process.env.ROLLUP_WATCH;

export default function createBasicConfig(_options, legacy) {
  const options = {
    outputDir: 'dist',
    ..._options,
  };

  return {
    input: options.input,
    output: {
      // output into given folder or default /dist. Output legacy into a /legacy subfolder
      dir: `${options.outputDir}${legacy ? '/legacy' : ''}`,
      format: legacy ? 'system' : 'esm',
      sourcemap: true,
      dynamicImportFunction: !legacy && 'importModule',
    },
    plugins: [
      !legacy && dynamicImportPolyfill(),
      resolve(),
      babel({
        babelrc: false,
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
              targets: legacy
                ? ['ie 11']
                : [
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
