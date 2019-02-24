import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

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
      // we can't reliably serve esm output, as we can't detect dynamic import support at the moment
      format: legacy ? 'system' : 'esm',
      sourcemap: true,
    },
    plugins: [
      // resolve bare import specifiers
      // TODO: Check options
      resolve(),
      babel({
        babelrc: false,
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-syntax-import-meta',
          // rollup rewrites import.meta.url, but makes them point to the file location after bundling
          // we want the location before bundling
          'bundled-import-meta',
          'module:fast-async',
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
              exclude: ['transform-async-to-generator', 'transform-regenerator'],
            },
          ],
        ],
      }),
      production && terser(),
    ],
  };
}
