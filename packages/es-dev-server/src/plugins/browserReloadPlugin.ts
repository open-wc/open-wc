/* eslint-disable no-console */
import { Plugin } from '../Plugin';
import debounce from 'debounce';

export interface BrowserReloadPluginConfig {
  watchDebounce: number;
}

export function browserReloadPlugin(cfg: BrowserReloadPluginConfig): Plugin {
  return {
    serverStart({ fileWatcher, messageChannel }) {
      if (messageChannel) {
        function onFileChanged() {
          console.log('Reloading connected browsers...\n');
          messageChannel?.sendMessage({ name: 'reload' });
        }

        const onChange = debounce(onFileChanged, cfg.watchDebounce);
        fileWatcher.addListener('change', onChange);
        fileWatcher.addListener('unlink', onChange);
      }
    },
  };
}
