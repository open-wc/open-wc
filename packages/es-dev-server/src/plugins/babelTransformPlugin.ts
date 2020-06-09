/* eslint-disable no-console */
import { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';
import { Plugin } from '../Plugin';
import { createCompatibilityTransform } from '../utils/compatibility-transform';
import { getUserAgentCompat } from '../utils/user-agent-compat';
import { getTextContent, setTextContent } from '@open-wc/building-utils/dom5-fork';
import { findJsScripts } from '@open-wc/building-utils';
import { parse as parseHtml, serialize as serializeHtml } from 'parse5';
import { URL, pathToFileURL, fileURLToPath } from 'url';
import { Context } from 'koa';
import { isPolyfill } from '../utils/utils';
import { TransformOptions } from '@babel/core';
import { TransformSyntaxError } from '../middleware/plugin-transform';

function createFilePath(context: Context, rootDir: string) {
  const path = context.path.endsWith('/') ? `${context.path}index.html` : context.path;
  return fileURLToPath(new URL(`.${path}`, `${pathToFileURL(rootDir)}/`));
}

interface BabelTransformConfig {
  rootDir: string;
  readUserBabelConfig: boolean;
  nodeResolve: boolean | RollupNodeResolveOptions;
  compatibilityMode: string;
  customBabelConfig?: TransformOptions;
  fileExtensions: string[];
  babelExclude: string[];
  babelModernExclude: string[];
  babelModuleExclude: string[];
}

export function babelTransformPlugin(config: BabelTransformConfig): Plugin {
  const compatibilityTransform = createCompatibilityTransform(config);
  const { rootDir } = config;

  async function transformJs(context: Context, code: string) {
    const filePath = createFilePath(context, rootDir);
    const transformModule = context.URL.searchParams.has('transform-systemjs');
    const uaCompat = getUserAgentCompat(context);

    try {
      return await compatibilityTransform({
        uaCompat,
        filePath,
        code,
        transformModule,
      });
    } catch (error) {
      throw new TransformSyntaxError(error.message);
    }
  }

  return {
    async transform(context) {
      // transform a single file
      if (context.response.is('js') && !isPolyfill(context.url)) {
        return { body: await transformJs(context, context.body) };
      }

      // transform inline JS
      if (context.response.is('html')) {
        const documentAst = parseHtml(context.body);
        const scriptNodes = findJsScripts(documentAst, {
          jsScripts: true,
          jsModules: true,
        });

        for (const node of scriptNodes) {
          const code = getTextContent(node);
          const resolvedCode = await transformJs(context, code);
          setTextContent(node, resolvedCode);
        }

        return { body: serializeHtml(documentAst) };
      }
    },
  };
}
