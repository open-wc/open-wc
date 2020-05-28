/* eslint-disable */

const path = require('path');
const copy = require('rollup-plugin-copy');
const { rollup } = require('rollup');
const { generateSW } = require('rollup-plugin-workbox');
const Eleventy = require('@11ty/eleventy');
const { createMpaConfig } = require('./docs/_building-rollup/createMpaConfig.js');

const elev = new Eleventy('./docs', './_site');
elev.setConfigPathOverride('./docs/.eleventy.js');
elev.setDryRun(true); // do not write to file system

/**
 * @param {object} config
 */
async function buildAndWrite(config) {
  const bundle = await rollup(config);

  if (Array.isArray(config.output)) {
    await bundle.write(config.output[0]);
    await bundle.write(config.output[1]);
  } else {
    await bundle.write(config.output);
  }
}

async function productionBuild(html) {
  const mpaConfig = createMpaConfig({
    outputDir: '_site',
    legacyBuild: false,
    html: { html },
    injectServiceWorker: false,
    workbox: false,
  });

  mpaConfig.plugins.push(
    generateSW({
      globIgnores: ['polyfills/*.js', 'legacy-*.js', 'nomodule-*.js'],
      swDest: path.join(process.cwd(), '_site', 'service-worker.js'),
      globDirectory: path.join(process.cwd(), '_site'),
      globPatterns: ['**/*.{html,js,json,css,webmanifest,png,gif}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: 'polyfills/*.js',
          handler: 'CacheFirst',
        },
      ],
    }),
  );

  const dest = '_site/';
  mpaConfig.plugins.push(
    copy({
      targets: [
        { src: 'docs/styles.css', dest },
        { src: 'docs/demoing/demo/custom-elements.json', dest },
        { src: 'docs/manifest.json', dest },
        { src: 'docs/**/*.{png,gif}', dest },
      ],
      flatten: false,
    }),
  );

  await buildAndWrite(mpaConfig);
}

async function main() {
  const htmlFiles = [];

  elev.config.filters['hook-for-rocket'] = (html, outputPath, inputPath) => {
    htmlFiles.push({
      html,
      name: outputPath.substring(8),
      rootDir: path.dirname(path.resolve(inputPath)),
    });
    return html;
  };

  await elev.init();
  await elev.write();

  await productionBuild(htmlFiles);
}

main();
