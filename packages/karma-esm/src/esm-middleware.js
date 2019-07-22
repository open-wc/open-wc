const request = require('request');
const minimatch = require('minimatch');
const { startServer } = require('es-dev-server/dist/server.js');
const { messageChannelEndpoint } = require('es-dev-server/dist/constants.js');
const { createEsmConfig } = require('./esm-config.js');

function esmMiddlewareFactory(config, karmaEmitter) {
  const karmaConfig = config;
  const watch = karmaConfig.autoWatch;

  const { esmConfig, polyfills, testLoaderBrowserScript, customBabelConfig } = createEsmConfig(
    karmaConfig,
  );

  const devServerPort = karmaConfig.port + 1;
  startServer({
    port: devServerPort,
    rootDir: karmaConfig.basePath,
    nodeResolve: esmConfig.nodeResolve,
    compatibilityMode: esmConfig.compatibility,
    moduleDirectories: esmConfig.moduleDirectories,
    readUserBabelConfig: esmConfig.babel,
    extraFileExtensions: esmConfig.fileExtensions,
    babelModernExclude: esmConfig.babelModernExclude,
    babelExclude: esmConfig.babelExclude,
    customMiddlewares: esmConfig.customMiddlewares,
    watch,
    customBabelConfig,
  });

  if (watch) {
    const messageChannel = request(`http://127.0.0.1:${devServerPort}${messageChannelEndpoint}`);
    messageChannel.addListener('data', message => {
      if (message.toString('utf-8').startsWith('event: file-changed')) {
        karmaEmitter.refreshFiles();
      }
    });
  }

  function isExcluded(url) {
    const cleanUrl = url.split('#')[0].split('?')[0];
    return esmConfig.exclude.some(ex => minimatch(cleanUrl, ex));
  }

  /**
   * @type {import('connect').NextHandleFunction}
   */
  function esmMiddleware(req, res, next) {
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
}

esmMiddlewareFactory.$inject = ['config', 'emitter'];

module.exports = esmMiddlewareFactory;
