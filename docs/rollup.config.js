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

    injectServiceWorker: false,
    workbox: {
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
    },
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
