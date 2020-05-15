/* eslint-disable no-console */
import { Options } from '@rollup/plugin-node-resolve';
import { Plugin } from '../Plugin';
import { createCompatibilityTransform, TransformJs } from '../utils/compatibility-transform';
import { getUserAgentCompat } from '../utils/user-agent-compat';
import { sendMessageToActiveBrowsers } from '../utils/message-channel';
import stripAnsi from 'strip-ansi';
import { getTextContent, setTextContent } from '@open-wc/building-utils/dom5-fork';
import { findJsScripts } from '@open-wc/building-utils';
import { parse as parseHtml, serialize as serializeHtml } from 'parse5';
import { URL, pathToFileURL, fileURLToPath } from 'url';
import { Context } from 'koa';
import { isPolyfill } from '../utils/utils';
import { TransformOptions } from '@babel/core';

function createFilePath(context: Context, rootDir: string) {
  return fileURLToPath(new URL(`.${context.path}`, `${pathToFileURL(rootDir)}/`));
}

interface BabelTransformConfig {
  rootDir: string;
  readUserBabelConfig: boolean;
  nodeResolve: boolean | Options;
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
    return compatibilityTransform({
      uaCompat,
      filePath,
      code,
      transformModule,
    });
  }

  return {
    async transform(context) {
      // transform a single file
      if (context.response.is('js') && !isPolyfill(context.url)) {
        try {
          return { body: await transformJs(context, context.body) };
        } catch (error) {
          const filePath = createFilePath(context, rootDir);
          let errorMessage = `Error compiling: ${error.message}`;

          if (errorMessage.startsWith(filePath)) {
            errorMessage = errorMessage.replace(filePath, context.url);
          }

          // send compile error to browser for logging
          context.body = errorMessage;
          context.status = 500;
          sendMessageToActiveBrowsers('error-message', JSON.stringify(stripAnsi(errorMessage)));
          console.error(`\n${errorMessage}`);
        }
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
