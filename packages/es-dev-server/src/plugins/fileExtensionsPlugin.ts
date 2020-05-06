import { Plugin } from '../Plugin';

/**
 * Plugin which serves configured file extensions as JS.
 */
export function fileExtensionsPlugin(): Plugin {
  let fileExtensions: string[];

  return {
    serverStart({ config }) {
      fileExtensions = config.fileExtensions.map(ext => (ext.startsWith('.') ? ext : `.${ext}`));
    },

    resolveMimeType(context) {
      if (fileExtensions.some(ext => context.path.endsWith(ext))) {
        return 'js';
      }
    },
  };
}
