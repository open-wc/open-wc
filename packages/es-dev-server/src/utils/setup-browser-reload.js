import debounce from 'debounce';
import { sendMessageToActiveBrowsers } from './message-channel.js';

/**
 * @typedef {object} SetupBrowserReloadConfig
 * @property {import('chokidar').FSWatcher} fileWatcher
 * @property {number} watchDebounce
 */

function onFileChanged() {
  sendMessageToActiveBrowsers('file-changed');
}

/**
 * @param {SetupBrowserReloadConfig} cfg
 */
export function setupBrowserReload(cfg) {
  cfg.fileWatcher.addListener('change', debounce(onFileChanged, cfg.watchDebounce));
}
