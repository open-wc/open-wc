const path = require('path');
const copy = require('rollup-plugin-copy');
const { createMpaConfig } = require('./_building-rollup/createMpaConfig.js');

module.exports = async () => {
  const mpaConfig = await createMpaConfig({
    outputDir: '_site',
    legacyBuild: true,
    inputGlob: '_site-dev/**/*.html',
    rootPath: path.resolve('_site-dev'),

    // development mode creates a non-minified build for debugging or development
    developmentMode: false, // process.env.ROLLUP_WATCH === 'true',

    // set to true to inject the service worker registration into your index.html
    injectServiceWorker: false,
    workbox: false,
  });

  const dest = '_site/';
  mpaConfig.plugins.push(
    copy({
      targets: [
        { src: '_site-dev/styles.css', dest },
        { src: '_site-dev/demoing/demo/custom-elements.json', dest },
        { src: '_site-dev/manifest.json', dest },
        { src: '_site-dev/**/*.{png,gif}', dest },
      ],
      flatten: false,
    }),
  );

  return mpaConfig;
};
