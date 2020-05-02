/* eslint-disable no-console */
import { FSWatcher } from 'chokidar';
import debounce from 'debounce';
import { sendMessageToActiveBrowsers } from './message-channel';

export interface SetupBrowserReloadConfig {
  fileWatcher: FSWatcher;
  watchDebounce: number;
}

function onFileChanged() {
  console.log('Reloading connected browsers...');
  console.log('');
  sendMessageToActiveBrowsers('file-changed');
}

export function setupBrowserReload(cfg: SetupBrowserReloadConfig) {
  const onChange = debounce(onFileChanged, cfg.watchDebounce);
  cfg.fileWatcher.addListener('change', onChange);
  cfg.fileWatcher.addListener('unlink', onChange);
}
