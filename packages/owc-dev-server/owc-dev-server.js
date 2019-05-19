#!/usr/bin/env node
/* eslint-disable no-console, global-require */
const express = require('express');
const path = require('path');
const fs = require('fs');
const opn = require('opn');
const transformMiddleware = require('express-transform-bare-module-specifiers').default;
const reloadInjectScript = require('./src/reload-inject-script');
const createFileWatcher = require('./src/file-watcher');
const getSslCertificates = require('./src/get-ssl-certificates');
const {
  port,
  hostname,
  watch,
  http2,
  userSslKeyPath,
  userSslCertPath,
  rootDir,
  appIndex,
  modulesDir,
  configFilePath,
  shouldOpen,
  openPath,
} = require('./src/command-line-args');

const app = express();

/** transform node-style imports to browser-style imports */
const transformOptions = { rootDir };
if (modulesDir) {
  const fullModulesPath = path.join(rootDir, modulesDir);
  if (!fs.existsSync(fullModulesPath)) {
    throw new Error(
      `Could not find "${fullModulesPath}". The modules dir needs to be a subfolder of root dir.`,
    );
  }

  transformOptions.modulesUrl = modulesDir;
}

/** Serves app index.html, injecting watch mode script if watching */
function serveIndexHTML(req, res, next) {
  if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {
    let index = fs.readFileSync(path.join(process.cwd(), path.sep, appIndex), 'utf-8');
    if (watch) {
      index = index.replace('</body>', `${reloadInjectScript}</body>`);
    }
    res.send(index);
  } else {
    next();
  }
}

/** Serves app index.html if the request was not a file request. This allows SPA routing */
function serveIndexHTMLFallback(req, res, next) {
  if (!req.url.includes('.')) {
    serveIndexHTML(req, res, next);
  } else {
    next();
  }
}

/** Adds any served files to file watcher, reloading the browser on change */
if (watch) {
  if (!appIndex) {
    throw new Error(`appIndex must be provided if using watch mode`);
  }
  const watchFile = createFileWatcher(app, appIndex);

  app.use((req, res, next) => {
    watchFile(req.url);
    next();
  });

  if (appIndex) {
    watchFile(appIndex);
  }
}

app.use('*', transformMiddleware(transformOptions));

// serve index.html from root path
if (appIndex) {
  app.use(path.join('/', appIndex.replace('index.html', '/')), serveIndexHTMLFallback);
  app.use(path.join('/', appIndex), serveIndexHTML);
}

// serve static files
app.use(express.static(rootDir));

// serve app index.html for requests that didn't match any file for SPA routing
if (appIndex) {
  const fullAppIndexPath = `${process.cwd()}/${appIndex}`;
  if (!fs.existsSync(fullAppIndexPath)) {
    throw new Error(`Could not find "${fullAppIndexPath}". The apps index file needs to exist.`);
  }

  if (!fs.lstatSync(fullAppIndexPath).isFile()) {
    throw new Error(
      `The apps index file needs to be a file. Provided path: "${fullAppIndexPath}".`,
    );
  }

  app.use(serveIndexHTMLFallback);
}

/** Server-sent-events endpoint to notify the browser about file changes */
if (watch) {
  app.get('/__owc-dev-server-watch__', (req, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    function onFileChanged() {
      res.write(`event: file-changed\ndata: \n\n`);
    }

    app.on('file-changed', onFileChanged);

    req.on('close', () => {
      app.removeListener('file-changed', onFileChanged);
    });
  });
}

/** Load additonal config file for express */
if (fs.existsSync(configFilePath)) {
  const appConfig = require(configFilePath); // eslint-disable-line import/no-dynamic-require, global-require
  appConfig(app);
}

function onServerStarted(error) {
  if (error) {
    console.error(error);
    process.exit(1);
    return;
  }

  const msgs = [];
  msgs.push(`owc-dev-server started on http${http2 ? 's' : ''}://${hostname}:${port}`);
  msgs.push(`  Serving files from '${rootDir}'.`);
  if (shouldOpen) {
    msgs.push(`  Opening browser on '${openPath}'`);
  }

  if (appIndex) {
    msgs.push(`  Using history API fallback, redirecting requests to '${appIndex}'`);
  }

  if (modulesDir) {
    const fullModulesPath = path.join(rootDir, modulesDir);
    msgs.push(`  Using "${fullModulesPath}" as modules dir`);
  }

  if (http2) {
    msgs.push(`  Using HTTP2 and HTTPS`);
  }

  console.log(msgs.join('\n'));

  // open browser if --open option was provided
  if (shouldOpen) {
    opn(`http${http2 ? 's' : ''}://${hostname}:${port}${openPath}`);
  }
}

if (http2) {
  const spdy = require('spdy');
  const { sslKey, sslCert } = getSslCertificates(userSslKeyPath, userSslCertPath);

  spdy.createServer({ key: sslKey, cert: sslCert }, app).listen(port, hostname, onServerStarted);
} else {
  app.listen(port, hostname, onServerStarted);
}
