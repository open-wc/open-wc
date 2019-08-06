/* eslint-disable no-inner-declarations, no-console */
const request = require('request');
const minimatch = require('minimatch');
const portfinder = require('portfinder');
const { startServer, createConfig, messageChannelEndpoint } = require('es-dev-server');
const { createEsmConfig } = require('./esm-config.js');

async function setupDevServer(karmaConfig, esmConfig, watch, babelConfig, karmaEmitter) {
  const devServerPort =
    typeof esmConfig.port === 'number' ? esmConfig.port : await portfinder.getPortPromise();

  const esDevServerConfig = createConfig({
    port: devServerPort,
    rootDir: karmaConfig.basePath,
    nodeResolve: esmConfig.nodeResolve,
    compatibility: esmConfig.compatibility,
    // option used to be called `moduleDirectories`
    // @ts-ignore
    moduleDirs: esmConfig.moduleDirs || esmConfig.moduleDirectories,
    babel: esmConfig.babel,
    fileExtensions: esmConfig.fileExtensions,
    babelModernExclude: esmConfig.babelModernExclude,
    babelExclude: esmConfig.babelExclude,
    // option used to be called `customMiddlewares`
    // @ts-ignore
    middlewares: esmConfig.middlewares || esmConfig.customMiddlewares,
    watch,
    babelConfig,
  });

  await startServer(esDevServerConfig);

  if (watch) {
    const messageChannel = request(`http://127.0.0.1:${devServerPort}${messageChannelEndpoint}`);
    messageChannel.addListener('data', message => {
      if (message.toString('utf-8').startsWith('event: file-changed')) {
        karmaEmitter.refreshFiles();
      }
    });
  }

  return devServerPort;
}

function esmMiddlewareFactory(config, karmaEmitter) {
  try {
    const karmaConfig = config;
    const watch = karmaConfig.autoWatch;

    const { esmConfig, polyfills, testLoaderBrowserScript, babelConfig } = createEsmConfig(
      karmaConfig,
    );

    function isExcluded(url) {
      const cleanUrl = url.split('#')[0].split('?')[0];
      return esmConfig.exclude.some(ex => minimatch(cleanUrl, ex));
    }

    // setting up the server is async, but we need to synchronously return a middleware.
    // set up the server and keep a promise that can be awaited
    let devServerPort;
    let setupServerPromise = setupDevServer(
      karmaConfig,
      esmConfig,
      watch,
      babelConfig,
      karmaEmitter,
    ).then(port => {
      devServerPort = port;
      setupServerPromise = null;
    });

    /**
     * @type {import('connect').NextHandleFunction}
     */
    async function esmMiddleware(req, res, next) {
      // wait for server to be set up if it hasn't yet
      if (!setupServerPromise) {
        await setupServerPromise;
      }

      if (req.url.startsWith('/polyfills')) {
        const [name] = req.url.split('/')[2].split('.');
        const polyfill = polyfills.find(p => p.name === name);
        if (polyfill) {
          res.setHeader('cache-control', 'public, max-age=31536000');
          res.setHeader('content-type', 'text/javascript');
          res.end(polyfill.code);
        } else {
          next();
        }
      } else if (req.url === '/esm-test-loader.js') {
        res.end(testLoaderBrowserScript);
      } else if (req.url.startsWith('/base') && !isExcluded(req.url)) {
        const forwardRequest = request(
          `http://127.0.0.1:${devServerPort}${req.url.replace('/base', '')}`,
        );
        req.pipe(forwardRequest);
        forwardRequest.pipe(res);
      } else {
        next();
      }
    }

    return esmMiddleware;
  } catch (error) {
    // karma swallows stack traces, so log them here manually
    console.error(error);
    throw error;
  }
}

esmMiddlewareFactory.$inject = ['config', 'emitter'];

module.exports = esmMiddlewareFactory;
