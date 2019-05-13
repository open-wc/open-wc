const fs = require('fs');
const path = require('path');
const esm = require('./src/karma-esm');

function karmaEsmMiddleware(logger) {
  const log = logger.create('middleware.esm');

  return (req, res, next) => {
    if (req.url.endsWith('.js') || req.url.endsWith('.ts')) {
      try {
        let relativeFilePath;
        if (req.url.startsWith('/base')) {
          relativeFilePath = req.url.replace('/base/', esm.pluginConfig.baseDir);
        }

        esm.pluginConfig.moduleDirectories.forEach(moduleDir => {
          if (req.url.startsWith(`/${moduleDir}`)) {
            relativeFilePath = req.url.replace(
              `/${moduleDir}`,
              path.join(esm.pluginConfig.moduleResolveRoot, moduleDir),
            );
          }
        });

        const fullFilePath = path.join(process.cwd(), relativeFilePath);
        if (!fs.existsSync(fullFilePath)) {
          throw new Error(`File does not exist: ${fullFilePath}`);
        }

        const fileContent = fs.readFileSync(fullFilePath, 'utf-8');
        res.setHeader('Content-Type', 'application/javascript');
        try {
          const compiledContent = esm.compile(fullFilePath, fileContent);
          res.end(compiledContent);
        } catch (error) {
          const message = `\n\n${error.message}\n at ${relativeFilePath}\n\n`;
          log.error(message);
          res.end(fileContent);
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
