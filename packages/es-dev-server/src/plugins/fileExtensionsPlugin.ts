import { Plugin } from '../Plugin';

interface FileExtensionsConfig {
  fileExtensions: string[];
}

/**
 * Plugin which serves configured file extensions as JS.
 */
export function fileExtensionsPlugin(config: FileExtensionsConfig): Plugin {
  const { fileExtensions } = config;

  return {
    resolveMimeType(context) {
      if (fileExtensions.some(ext => context.path.endsWith(ext))) {
        return 'js';
      }
    },
  };
}
