const express = require('express');
const path = require('path');
const fs = require('fs');
const transformMiddleware = require('express-transform-bare-module-specifiers').default;
const browserReloadScript = require('./browser-reload-script');
const createFileWatcher = require('./file-watcher');
const { watch, rootDir, appIndex, modulesDir } = require('./command-line-args');

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
      index = index.replace('</body>', `${browserReloadScript}</body>`);
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

/**
 * Sets up file serving logic
 */
function setupFileServer(app) {
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
}

module.exports = setupFileServer;
