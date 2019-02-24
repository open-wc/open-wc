import path from 'path';
import mkdirp from 'mkdirp';
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { parse, serialize } from 'parse5';
import {
  query,
  queryAll,
  predicates,
  constructors,
  setAttribute,
  getAttribute,
  append,
  remove,
} from 'dom5';

const prefix = '[rollup-plugin-legacy-browsers]:';
const wcPolyfillImports = [
  '@webcomponents/webcomponents-platform/webcomponents-platform.js',
  '@webcomponents/template/template.js',
  '@webcomponents/shadydom/src/shadydom.js',
  '@webcomponents/custom-elements/src/custom-elements.js',
  '@webcomponents/shadycss/entrypoints/scoping-shim.js',
  '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
]
  .map(i => `import '${i}';`)
  .join('');
let outputHTML;
let inputPaths;
let inputPath;

/** Reads file as HTML AST */
function readHTML(file) {
  return parse(readFileSync(file, 'utf-8'));
}

/** Returns output HTML path */
const getOutputPath = dir => path.join(dir, 'index.html');

/** Writes given HTML AST to output index.html */
function writeOutputHTML(dir, html) {
  const outputPath = getOutputPath(dir);
  mkdirp.sync(path.dirname(outputPath));
  writeFileSync(outputPath, serialize(html));
}

function createElement(tag, attributes) {
  const element = constructors.element(tag);
  if (attributes) {
    Object.keys(attributes).forEach(key => {
      setAttribute(element, key, attributes[key]);
    });
  }
  return element;
}

/**
 * Gets the output HTML as AST. Rollup might run with multiple outputs, but there
 * should be only one index.html output. Therefore we check if it wasn't already
 * created before. If there is no index.html yet, we copy over the input index.html
 * with the original module scripts removed.
 */
function getOutputHTML(dir) {
  if (outputHTML) {
    return outputHTML;
  }
  outputHTML = readHTML(inputPath);
  const scripts = queryAll(outputHTML, predicates.hasTagName('script'));
  const moduleScripts = scripts.filter(script => getAttribute(script, 'type') === 'module');
  moduleScripts.forEach(moduleScript => {
    remove(moduleScript);
  });

  writeOutputHTML(dir, outputHTML);
  return outputHTML;
}

/**
 * Writes module scripts to output HTML file
 */
function writeModules(outputConfig) {
  const indexHTML = getOutputHTML(outputConfig.dir);
  const head = query(indexHTML, predicates.hasTagName('head'));
  const body = query(indexHTML, predicates.hasTagName('body'));
  const loadScript = createElement('script');
  const loadScriptText = constructors.text(`
		${inputPaths.map(src => `import('${src}');`)}
		window.supportsDynamicImport = true;
	`);
  append(loadScript, loadScriptText);
  append(body, loadScript);

  inputPaths.forEach(src => {
    append(
      head,
      createElement('link', { rel: 'preload', as: 'script', crossorigin: 'anonymous', href: src }),
    );
  });
  writeOutputHTML(outputConfig.dir, indexHTML);
}

/**
 * Write scripts to be loaded by SystemJS module polyfills.
 */
function writeLegacyModules(pluginConfig, outputConfig) {
  const outputPath = outputConfig.dir.replace('/legacy', '');
  const indexHTML = getOutputHTML(outputPath);
  const body = query(indexHTML, predicates.hasTagName('body'));
  const polyfillsDir = `${outputConfig.dir}/polyfills`;
  mkdirp.sync(polyfillsDir);

  // Inject core-js polyfills
  if (pluginConfig.polyfillCoreJs) {
    copyFileSync(require.resolve('core-js/client/core.min.js'), `${polyfillsDir}/core-js.js`);
    const coreJsScript = createElement('script', {
      src: `legacy/polyfills/core-js.js`,
      nomodule: '',
    });
    append(body, coreJsScript);
  }

  // Inject system-js loader and import modules
  copyFileSync(require.resolve('systemjs/dist/s.min.js'), `${polyfillsDir}/system-loader.js`);
  const systemScript = createElement('script');
  const systemScriptText = constructors.text(`
		if (!window.supportsDynamicImport) {
			const systemJsLoaderTag = document.createElement('script');
			systemJsLoaderTag.src = './legacy/polyfills/system-loader.js';
			systemJsLoaderTag.addEventListener('load', function () {
				${inputPaths.map(src => `System.import('./${path.join('legacy', src)}');`)}
			});
			document.head.appendChild(systemJsLoaderTag);
		}
	`);
  append(systemScript, systemScriptText);
  append(body, systemScript);

  writeOutputHTML(outputPath, indexHTML);
}

export default (_pluginConfig = {}) => {
  const pluginConfig = {
    // Whether this the systemjs output for legacy browsers
    legacy: false,
    // Whether to inject core-js (Object.assign, Promise, Array.prototype.some etc.) polyfills
    polyfillCoreJs: true,
    // Whether to inject webcomponentsjs polyfills. These are only added if on the legacy build
    polyfillWebComponents: false,
    ..._pluginConfig,
  };

  return {
    name: 'index-html',

    /**
     * Takes configured index.html input, looking for all module scripts and converting them to
     * module inputs for rollup.
     */
    options(config) {
      if (typeof config.input === 'string' && config.input.endsWith('index.html')) {
        inputPath = config.input;
        const indexHTML = readHTML(config.input);
        const scripts = queryAll(indexHTML, predicates.hasTagName('script'));
        const moduleScripts = scripts.filter(script => getAttribute(script, 'type') === 'module');

        if (moduleScripts.length === 0) {
          throw new Error(
            `${prefix} Could not find any module script in configured input: ${config.input}`,
          );
        }

        if (moduleScripts.some(script => !getAttribute(script, 'src'))) {
          throw new Error(`${prefix} Module scripts without a 'src' attribute are not supported.`);
        }
        const indexDir = path.dirname(config.input);

        inputPaths = moduleScripts.map(script => getAttribute(script, 'src'));
        return {
          ...config,
          input: inputPaths.map(p => path.join(indexDir, p)),
        };
      }

      return null;
    },

    /**
     * Injects generated module into index.html
     */
    generateBundle(outputConfig, bundles) {
      if (!pluginConfig.legacy) {
        writeModules(outputConfig, bundles);
      } else {
        writeLegacyModules(pluginConfig, outputConfig, bundles);
      }
    },

    /**
     * If on the legacy build, injects web components polyfill to entry point modules.
     */
    transform(code, id) {
      if (
        pluginConfig.legacy &&
        pluginConfig.polyfillWebComponents &&
        inputPaths.map(p => require.resolve(p)).includes(id)
      ) {
        return {
          code: `${wcPolyfillImports}${code}`,
          map: null,
        };
      }

      return null;
    },
  };
};
