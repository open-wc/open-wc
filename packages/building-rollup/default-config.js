import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import indexHTML from './plugins/rollup-plugin-index-html';

const production = !process.env.ROLLUP_WATCH;
const prefix = '[owc-building-rollup]';

function createConfig(options, legacy) {
  if (!options.input) {
    throw new Error(`${prefix}: missing option 'input'.`);
  }

  if (typeof options.input !== 'string' || !options.input.endsWith('.html')) {
    throw new Error(`${prefix}: input should point to a single .html file.`);
  }

  return {
    input: options.input,
    output: {
      // output into given folder or default /dist. Output legacy into a /legacy subfolder
      dir: `${options.output || 'dist'}${legacy ? '/legacy' : ''}`,
      // we can't reliably serve esm output, as we can't detect dynamic import support at the moment
      format: legacy ? 'system' : 'esm',
      sourcemap: true,
    },
    plugins: [
      indexHTML({
        legacy,
        polyfillWebComponents: legacy,
      }),
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

export default function createDefaultConfig(options) {
  const config = createConfig(options, false);
  const legacyConfig = createConfig(options, true);

  return production && options.legacy ? [config, legacyConfig] : [config];
}
