import debounce from 'debounce';
import path from 'path';
import { sendMessageToActiveBrowsers } from './message-channel.js';
import { toBrowserPath } from './utils.js';

/**
 * @typedef {object} SetupBrowserReloadConfig
 * @property {string} rootDir
 * @property {import('chokidar').FSWatcher} fileWatcher
 * @property {number} watchDebounce
 */

function onFileChanged(filePath, rootDir) {
  const relativePath = path.relative(rootDir, filePath);
  const browserPath = `/${toBrowserPath(relativePath)}`;
  sendMessageToActiveBrowsers('file-changed', browserPath);
}

/**
 * @param {SetupBrowserReloadConfig} cfg
 */
export function setupBrowserReload(cfg) {
  cfg.fileWatcher.addListener('change', debounce((filePath) => onFileChanged(filePath, cfg.rootDir), cfg.watchDebounce));
}
