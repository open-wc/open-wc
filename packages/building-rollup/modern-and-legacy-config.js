import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import modernWeb from './plugins/rollup-plugin-modern-web/rollup-plugin-modern-web.js';

// const production = !process.env.ROLLUP_WATCH;
const production = false;
const prefix = '[owc-building-rollup]';

function createConfig(_options, legacy) {
  const options = {
    outputDir: 'dist',
    ..._options,
  };

  return {
    input: options.input,
    treeshake: !!production,
    output: {
      // output into given folder or default /dist. Output legacy into a /legacy subfolder
      dir: `${options.outputDir}${legacy ? '/legacy' : ''}`,
      format: legacy ? 'system' : 'esm',
      sourcemap: true,
      dynamicImportFunction: !legacy && 'importModule',
    },
    plugins: [
      // minify html and css template literals if in production
      production &&
        minifyHTML({
          failOnError: true,
        }),

      // parse input index.html as input, feed any modules found to rollup and add polyfills
      modernWeb({
        legacy,
        polyfillDynamicImports: !legacy,
        polyfillBabel: legacy,
        polyfillWebcomponents: legacy,
      }),

      // resolve bare import specifiers
      resolve(),

      // run code through babel
      babel({
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-syntax-import-meta',
          // rollup rewrites import.meta.url, but makes them point to the file location after bundling
          // we want the location before bundling
          ['bundled-import-meta', { importStyle: 'baseURI' }],
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

      // only minify if in production
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
