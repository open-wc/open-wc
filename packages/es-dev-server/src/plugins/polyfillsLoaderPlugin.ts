import path from 'path';
import { GeneratedFile } from 'polyfills-loader';

import { injectPolyfillsLoader } from '../utils/inject-polyfills-loader';
import { toBrowserPath, isInlineScript, RequestCancelledError, toFilePath } from '../utils/utils';
import { getUserAgentCompat } from '../utils/user-agent-compat';
import { PolyfillsLoaderConfig } from '../utils/inject-polyfills-loader';
import { Plugin } from '../Plugin';

interface IndexHTMLData {
  indexHTML: string;
  lastModified: string;
  inlineScripts: GeneratedFile[];
}

export interface PolyfillsLoaderMiddlewareConfig {}

/**
 * Creates plugin which injects polyfills and code into HTML pages which allows
 * it to run on legacy browsers.
 */
export function polyfillsLoaderPlugin(): Plugin {
  // index html data, keyed by url
  const indexHTMLData = new Map<string, IndexHTMLData>();
  // polyfills, keyed by request path
  const polyfills = new Map<string, string>();

  let compatibilityMode: string;
  let rootDir: string;
  let polyfillsLoaderConfig: Partial<PolyfillsLoaderConfig>;

  return {
    serverStart({ config }) {
      ({ compatibilityMode, rootDir, polyfillsLoaderConfig = {} } = config);
    },

    async serve(context) {
      const uaCompat = getUserAgentCompat(context);

      /**
       * serve extracted inline module if url matches. an inline module requests has this
       * structure:
       * `/inline-script-<index>?source=<index-html-path>`
       * for example:
       * `/inline-script-2?source=/src/index-html`
       * source query parameter is the index.html the inline module came from, index is the index
       * of the inline module in that index.html. We use these to look up the correct code to
       * serve
       */
      if (isInlineScript(context.url)) {
        const sourcePath = context.URL.searchParams.get('source');
        if (!sourcePath) {
          throw new Error(`${context.url} is missing a source param`);
        }

        const data = indexHTMLData.get(`${uaCompat.browserTarget}${sourcePath}`);
        if (!data) {
          return undefined;
        }

        const name = path.basename(context.path);
        const inlineScript = data.inlineScripts.find(f => f.path.split('?')[0] === name);
        if (!inlineScript) {
          throw new Error(`Could not find inline module for ${context.url}`);
        }

        return {
          body: inlineScript.content,
          headers: {
            'cache-control': 'no-cache',
            'last-modified': data.lastModified,
          } as Record<string, string>,
        };
      }

      // serve polyfill from memory if url matches
      const polyfill = polyfills.get(context.url);
      if (polyfill) {
        // aggresively cache polyfills, they are hashed so content changes bust the cache
        return { body: polyfill, headers: { 'cache-control': 'public, max-age=31536000' } };
      }
    },

    async transform(context) {
      // check if we are serving a HTML file
      if (!context.response.is('html')) {
        return undefined;
      }

      const uaCompat = getUserAgentCompat(context);
      const lastModified = context.response.headers['last-modified'];

      // return cached index.html if it did not change
      const data = indexHTMLData.get(`${uaCompat.browserTarget}${context.path}`);
      // if there is no lastModified cached, the HTML file is not served from the
      // file system
      if (data && data?.lastModified === lastModified) {
        return { body: data.indexHTML };
      }

      const indexFilePath = path.join(rootDir, toFilePath(context.path));
      try {
        // transforms index.html to make the code load correctly with the right polyfills and shims
        const result = await injectPolyfillsLoader({
          htmlString: context.body,
          indexUrl: context.url,
          indexFilePath,
          compatibilityMode,
          polyfillsLoaderConfig,
          uaCompat,
        });

        // set new index.html
        context.body = result.indexHTML;

        const polyfillsMap = new Map();
        result.polyfills.forEach(file => {
          polyfillsMap.set(file.path, file);
        });

        // cache index for later use
        indexHTMLData.set(`${uaCompat.browserTarget}${context.url}`, {
          ...result,
          inlineScripts: result.inlineScripts,
          lastModified,
        });

        // cache polyfills for serving
        result.polyfills.forEach(p => {
          let root = context.path.endsWith('/') ? context.path : path.posix.dirname(context.path);
          if (!root.endsWith('/')) {
            root = `${root}/`;
          }
          polyfills.set(`${root}${toBrowserPath(p.path)}`, p.content);
        });
      } catch (error) {
        if (error instanceof RequestCancelledError) {
          return;
        }
        throw error;
      }
    },
  };
}
