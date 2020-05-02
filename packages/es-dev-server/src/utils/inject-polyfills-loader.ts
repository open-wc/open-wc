import {
  getAttribute,
  getTextContent,
  remove,
  setTextContent,
} from '@open-wc/building-utils/dom5-fork';
import { findJsScripts } from '@open-wc/building-utils';
import { parse, serialize, Document as DocumentAst, Node as NodeAst } from 'parse5';
import path from 'path';
import deepmerge from 'deepmerge';
import {
  injectPolyfillsLoader as originalInjectPolyfillsLoader,
  fileTypes,
  getScriptFileType,
} from 'polyfills-loader';
import { UserAgentCompat } from './user-agent-compat';
import {
  PolyfillsConfig,
  PolyfillsLoaderConfig as OriginalPolyfillsLoaderConfig,
  GeneratedFile,
  File,
} from 'polyfills-loader';
import { TransformJs } from './compatibility-transform';
import sytemJsTransformResolver from '../browser-scripts/systemjs-transform-resolver';
import { compatibilityModes } from '../constants';
import { logDebug } from './utils';

export interface PolyfillsLoaderConfig extends OriginalPolyfillsLoaderConfig {
  exclude?: {
    jsModules?: boolean;
    inlineJsModules?: boolean;
    jsScripts?: boolean;
    inlineJsScripts?: boolean;
  };
}

export interface InjectPolyfillsLoaderConfig {
  compatibilityMode: string;
  uaCompat: UserAgentCompat;
  htmlString: string;
  indexUrl: string;
  indexFilePath: string;
  transformJs: TransformJs;
  polyfillsLoaderConfig?: Partial<PolyfillsLoaderConfig>;
}

const allPolyfills: PolyfillsConfig = {
  coreJs: true,
  regeneratorRuntime: true,
  fetch: true,
  abortController: true,
  webcomponents: true,
};

const allPolyfillsWithSystemjs: PolyfillsConfig = {
  ...allPolyfills,
  custom: [
    {
      name: 'systemjs',
      path: require.resolve('systemjs/dist/system.min.js'),
      initializer: sytemJsTransformResolver,
    },
  ],
};

/**
 * In max compatibility mode, we need to load the regenerator runtime on all browsers since
 * we're always compiling to es5.
 */
const maxPolyfills: PolyfillsConfig = {
  ...allPolyfillsWithSystemjs,
  regeneratorRuntime: 'always',
};

function getPolyfillsConfig(cfg: InjectPolyfillsLoaderConfig): PolyfillsConfig {
  switch (cfg.compatibilityMode) {
    case compatibilityModes.MAX:
      return maxPolyfills;
    case compatibilityModes.MIN:
      return allPolyfills;
    case compatibilityModes.AUTO:
    case compatibilityModes.ALWAYS:
      if (cfg.compatibilityMode === compatibilityModes.AUTO && cfg.uaCompat.modern) {
        return {};
      }

      if (cfg.uaCompat.supportsEsm) {
        return allPolyfills;
      }
      return allPolyfillsWithSystemjs;
    default:
      return {};
  }
}

function findScripts(cfg: InjectPolyfillsLoaderConfig, documentAst: DocumentAst) {
  const scriptNodes = findJsScripts(
    documentAst,
    cfg.polyfillsLoaderConfig && cfg.polyfillsLoaderConfig.exclude,
  );

  const files: File[] = [];
  const inlineScripts: GeneratedFile[] = [];
  const inlineScriptNodes: NodeAst[] = [];
  scriptNodes.forEach((scriptNode, i) => {
    const type = getScriptFileType(scriptNode);
    let src = getAttribute(scriptNode, 'src');

    if (!src) {
      src = `inline-script-${i}.js?source=${encodeURIComponent(cfg.indexUrl)}`;
      inlineScripts.push({
        path: src,
        type,
        content: getTextContent(scriptNode),
      });
      inlineScriptNodes.push(scriptNode);
    }

    files.push({
      type,
      path: src,
    });
  });

  return { files, inlineScripts, scriptNodes, inlineScriptNodes };
}

function hasPolyfills(polyfills?: PolyfillsConfig) {
  if (!polyfills) {
    return false;
  }
  const { hash, custom, ...rest } = polyfills;
  return (custom && custom.length > 0) || Object.values(rest).some(v => v !== false);
}

async function transformInlineScripts(
  cfg: InjectPolyfillsLoaderConfig,
  inlineScriptNodes: NodeAst[],
) {
  const asyncTransforms = [];

  for (const scriptNode of inlineScriptNodes) {
    // we need to refer to an actual file for node resolve to work properly
    const filePath = cfg.indexFilePath.endsWith(path.sep)
      ? path.join(cfg.indexFilePath, 'index.html')
      : cfg.indexFilePath;

    const asyncTransform = cfg
      .transformJs({
        filePath,
        uaCompat: cfg.uaCompat,
        code: getTextContent(scriptNode),
        transformModule: false,
      })
      .then((code: string) => {
        setTextContent(scriptNode, code);
      });
    asyncTransforms.push(asyncTransform);
  }

  await Promise.all(asyncTransforms);
}

/**
 * transforms index.html, extracting any modules and import maps and adds them back
 * with the appropriate polyfills, shims and a script loader so that they can be loaded
 * at the right time
 */
export async function injectPolyfillsLoader(
  cfg: InjectPolyfillsLoaderConfig,
): Promise<{ indexHTML: string; inlineScripts: GeneratedFile[]; polyfills: GeneratedFile[] }> {
  const polyfillModules =
    ([compatibilityModes.AUTO, compatibilityModes.ALWAYS].includes(cfg.compatibilityMode) &&
      !cfg.uaCompat.supportsEsm) ||
    cfg.compatibilityMode === compatibilityModes.MAX;

  const documentAst = parse(cfg.htmlString);
  const { files, inlineScripts, scriptNodes, inlineScriptNodes } = findScripts(cfg, documentAst);

  const polyfillsConfig = getPolyfillsConfig(cfg);
  const polyfillsLoaderConfig = deepmerge(
    {
      modern: {
        files: files.map(f => ({
          ...f,
          type: f.type === fileTypes.MODULE && polyfillModules ? fileTypes.SYSTEMJS : f.type,
        })),
      },
      polyfills: polyfillsConfig,
      preload: false,
    },
    cfg.polyfillsLoaderConfig || {},
  );

  if (!hasPolyfills(polyfillsLoaderConfig.polyfills) && !polyfillModules) {
    // no polyfils module polyfills, so we don't need to inject a loader
    if (inlineScripts && inlineScripts.length > 0) {
      // there are inline scripts, we need to transform them
      // transformInlineScripts mutates documentAst
      await transformInlineScripts(cfg, inlineScriptNodes);
      return { indexHTML: serialize(documentAst), inlineScripts, polyfills: [] };
    }
    return { indexHTML: cfg.htmlString, inlineScripts: [], polyfills: [] };
  }

  // we will inject a loader, so we need to remove the inline script nodes as the loader
  // will include them as virtual modules
  for (const scriptNode of scriptNodes) {
    // remove script from document
    remove(scriptNode);
  }

  logDebug('[polyfills-loader] config', polyfillsLoaderConfig);

  const result = originalInjectPolyfillsLoader(serialize(documentAst), polyfillsLoaderConfig);

  logDebug(
    '[polyfills-loader] generated polyfills: ',
    result.polyfillFiles.map(p => ({ ...p, content: '[stripped]' })),
  );

  logDebug(
    'Inline scripts generated by polyfills-loader',
    inlineScripts.map(p => ({ ...p, content: '[stripped]' })),
  );

  return {
    indexHTML: result.htmlString,
    inlineScripts,
    polyfills: result.polyfillFiles,
  };
}
