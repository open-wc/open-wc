/* eslint-disable no-console */
import debounce from 'debounce';
import { sendMessageToActiveBrowsers } from './message-channel.js';

/**
 * @typedef {object} SetupBrowserReloadConfig
 * @property {import('chokidar').FSWatcher} fileWatcher
 * @property {number} watchDebounce
 */

function onFileChanged() {
  console.log('Reloading connected browsers...');
  console.log('');
  sendMessageToActiveBrowsers('file-changed');
}

/**
 * @param {SetupBrowserReloadConfig} cfg
 */
export function setupBrowserReload(cfg) {
  const onChange = debounce(onFileChanged, cfg.watchDebounce);
  cfg.fileWatcher.addListener('change', onChange);
  cfg.fileWatcher.addListener('unlink', onChange);
}
