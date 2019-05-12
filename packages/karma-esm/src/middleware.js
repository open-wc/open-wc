const fs = require('fs');
const path = require('path');
const esm = require('./karma-esm');

/**
 * Middleware for serving es modules. Karma doesn't serve any files not specified
 * beforehand. This is extremely inconvenient when working with es modules, as many
 * files are requested on the fly.
 */

function getCode(filePath) {
  // take code from cache if available
  const cachedCode = esm.compiler.getFromCache(filePath);
  if (cachedCode) {
    return cachedCode;
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }

  // otherwise read code from file and compile it
  const code = fs.readFileSync(filePath, 'utf-8');
  return esm.compiler.compile(filePath, code);
}

function karmaEsmMiddleware(logger) {
  const log = logger.create('middleware.esm');

  return (req, res, next) => {
    if (req.url.endsWith('.js') || req.url.endsWith('.ts')) {
      try {
        let relativeFilePath;

        // remove the /base prefix added by karma
        if (req.url.startsWith('/base')) {
          relativeFilePath = req.url.replace('/base/', esm.pluginConfig.baseDir);
        }

        // rewrite module folder prefix to a location on the file system
        // default: /node_modules -> ./node_modules
        esm.pluginConfig.moduleDirectories.forEach(moduleDir => {
          if (req.url.startsWith(`/${moduleDir}`)) {
            relativeFilePath = req.url.replace(
              `/${moduleDir}`,
              path.join(esm.pluginConfig.moduleResolveRoot, moduleDir),
            );
          }
        });

        const fullFilePath = path.join(process.cwd(), relativeFilePath);

        res.setHeader('Content-Type', 'application/javascript');
        try {
          const code = getCode(fullFilePath);
          res.end(code);
        } catch (error) {
          const message = `\n\n${error.message}\n at ${relativeFilePath}\n\n`;
          log.error(message);
          res.end(message);
        }
      } catch (error) {
        log.error(error.message);
        res.statusCode = 500;
        res.end(error.message);
      }
    } else {
      next();
    }
  };
}

karmaEsmMiddleware.$inject = ['logger'];

module.exports = karmaEsmMiddleware;
