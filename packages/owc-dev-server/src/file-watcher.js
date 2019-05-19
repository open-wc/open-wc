const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

/**
 * Creates a file watcher, returning a function which watches a single
 * file for changes. Fires a `file-changed` event on the given express
 * app on file changes.
 */
module.exports = function createFileWatcher(app, indexHTML) {
  const watchedFiles = new Set();
  const watcher = chokidar.watch(indexHTML);

  watcher.on('change', () => {
    app.emit('file-changed');
  });

  return function watchFile(file) {
    if (file.lastIndexOf('.') === -1) {
      return;
    }

    if (watchedFiles.has(file)) {
      return;
    }

    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      return;
    }

    watcher.add(fullPath);
    watchedFiles.add(file);
  };
};
