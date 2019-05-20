#!/usr/bin/env node
/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const fs = require('fs');
const opn = require('opn');
const setupFileServer = require('./src/setup-file-server');
const {
  port,
  hostname,
  watch,
  rootDir,
  appIndex,
  modulesDir,
  configFilePath,
  shouldOpen,
  openPath,
} = require('./src/command-line-args');

const app = express();

/** Load additonal config file for express */
if (fs.existsSync(configFilePath)) {
  const appConfig = require(configFilePath); // eslint-disable-line import/no-dynamic-require, global-require
  appConfig(app);
}

setupFileServer(app);

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

app.listen(port, hostname, () => {
  const msgs = [];
  msgs.push(`owc-dev-server started on http://${hostname}:${port}`);
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

  console.log(msgs.join('\n'));
});

// open browser if --open option was provided
if (shouldOpen) {
  opn(`http://${hostname}:${port}${openPath}`);
}
