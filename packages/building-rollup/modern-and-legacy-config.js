import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import modernWeb from './plugins/rollup-plugin-modern-web/rollup-plugin-modern-web.js';

const production = !process.env.ROLLUP_WATCH;
const prefix = '[owc-building-rollup]';

function createConfig(_options, legacy) {
  const options = {
    outputDir: 'dist',
    babel: true,
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
      modernWeb({
        legacy,
        polyfillDynamicImports: !legacy,
        polyfillBabel: legacy,
        polyfillWebcomponents: legacy,
      }),
      resolve(),
      babel &&
        babel({
          babelrc: false,
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-syntax-import-meta',
            // rollup rewrites import.meta.url, but makes them point to the file location after bundling
            // we want the location before bundling
            'bundled-import-meta',
            ...((options.babel && options.babel.plugins) || []),
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
  if (!options.input) {
    throw new Error(`${prefix}: missing option 'input'.`);
  }

  if (typeof options.input !== 'string' || !options.input.endsWith('.html')) {
    throw new Error(`${prefix}: input should point to a single .html file.`);
  }

  return [createConfig(options, false), createConfig(options, true)];
}
