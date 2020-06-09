/** @typedef {import('./types').BasicOptions} BasicOptions */

/* eslint-disable no-param-reassign */
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const merge = require('deepmerge');
const {
  createBabelConfigRollupBuild,
  babelConfigRollupGenerate,
  babelConfigLegacyRollupGenerate,
  babelConfigSystemJs,
} = require('./babel/babel-configs');
const { bundledBabelHelpers } = require('./babel/rollup-plugin-bundled-babel-helpers');
const { isFalsy, pluginWithOptions, dedupedBabelPlugin } = require('./utils');

/**
 * @param {BasicOptions} userOptions
 */
function createBasicConfig(userOptions = {}) {
  const opts = merge(
    {
      developmentMode: !!process.env.ROLLUP_WATCH,
      outputDir: 'dist',
      nodeResolve: true,
      babel: true,
      terser: true,
    },
    userOptions,
  );
  const { developmentMode } = userOptions;
  const fileName = `[${developmentMode ? 'name' : 'hash'}].js`;
  const assetName = `[${developmentMode ? 'name' : 'hash'}][extname]`;

  const config = {
    preserveEntrySignatures: false,
    treeshake: !developmentMode,

    output: {
      entryFileNames: fileName,
      chunkFileNames: fileName,
      assetFileNames: assetName,
      format: 'es',
      dir: opts.outputDir,
      plugins: [
        // build to js supported by modern browsers
        babel.generated(babelConfigRollupGenerate),
        // create babel-helpers chunk based on es5 build
        bundledBabelHelpers({ minify: !developmentMode }),
      ],
    },

    plugins: [
      // resolve bare module imports
      pluginWithOptions(nodeResolve, opts.nodeResolve, {
        customResolveOptions: {
          moduleDirectory: ['node_modules', 'web_modules'],
        },
      }),

      // build non-standard syntax to standard syntax and other babel optimization plugins
      // user plugins are deduped to allow overriding
      dedupedBabelPlugin(babel, opts.babel, createBabelConfigRollupBuild(developmentMode)),

      // minify js code
      !developmentMode && pluginWithOptions(terser, opts.terser, { output: { comments: false } }),
    ].filter(isFalsy),
  };

  // when we need to add an additional legacy build, we turn the output option into an array
  // of output configs
  if (opts.legacyBuild) {
    // @ts-ignore
    config.output = [
      config.output,
      {
        ...config.output,
        entryFileNames: `nomodule-${fileName}`,
        chunkFileNames: `nomodule-${fileName}`,
        assetFileNames: `nomodule-${assetName}`,
        plugins: [
          // buid to es5
          babel.generated(babelConfigLegacyRollupGenerate),
          // create babel-helpers chunk based on es5 build
          bundledBabelHelpers({ format: 'system', minify: !developmentMode }),
          // build to systemjs after helpers, so that helpers can be statically analyzed
          babel.generated(babelConfigSystemJs),
        ],
      },
    ];
  }
  return config;
}

module.exports = { createBasicConfig };
