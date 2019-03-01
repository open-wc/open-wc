import path from 'path';
import mkdirp from 'mkdirp';
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
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
  if (existsSync(`${dir}/index.html`)) {
    return readHTML(`${dir}/index.html`);
  }

  const outputHTML = readHTML(inputPath);
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
function writeModules(pluginConfig, outputConfig) {
  const indexHTML = getOutputHTML(outputConfig.dir);
  const head = query(indexHTML, predicates.hasTagName('head'));
  const body = query(indexHTML, predicates.hasTagName('body'));

  if (pluginConfig.preventLegacyModuleRequest) {
    // some browsers (IE, edge, older safari/firefox) request module scripts once or multiple times
    // but don't run it. this is wasteful. we can fix this by preloading the module and importing
    // it in the module script
    const script = createElement('script', { type: 'module' });
    const scriptText = constructors.text(`
      ${inputPaths.map(src => `import '${src}';`)}
    `);

    append(script, scriptText);
    append(body, script);
    inputPaths.forEach(src => {
      append(
        head,
        createElement('link', {
          rel: 'preload',
          as: 'script',
          crossorigin: 'anonymous',
          href: src,
        }),
      );
    });
  } else {
    inputPaths.forEach(src => {
      const script = createElement('script', {
        type: 'module',
        src,
      });
      append(body, script);
    });
  }

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

  // Inject babel polyfills
  if (pluginConfig.babelPolyfills) {
    copyFileSync(
      require.resolve('@babel/polyfill/browser.js'),
      `${polyfillsDir}/babel-polyfills.js`,
    );
    const coreJsScript = createElement('script', {
      src: `legacy/polyfills/babel-polyfills.js`,
      nomodule: '',
    });
    append(body, coreJsScript);
  }

  if (pluginConfig.webcomponentPolyfills) {
    copyFileSync(
      require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
      `${polyfillsDir}/webcomponent-polyfills.js`,
    );
    const coreJsScript = createElement('script', {
      src: `legacy/polyfills/webcomponent-polyfills.js`,
      nomodule: '',
    });
    append(body, coreJsScript);
  }

  copyFileSync(require.resolve('systemjs/dist/s.min.js'), `${polyfillsDir}/system-loader.js`);
  const systemJsScript = createElement('script', {
    src: `legacy/polyfills/system-loader.js`,
    nomodule: '',
  });
  append(body, systemJsScript);

  const script = createElement('script', { nomodule: '' });
  const scriptText = constructors.text(`
    ${inputPaths.map(src => `System.import('./${path.join('legacy', src)}');`)}
	`);
  append(script, scriptText);
  append(body, script);

  writeOutputHTML(outputPath, indexHTML);
}

export default (_pluginConfig = {}) => {
  const pluginConfig = {
    // Whether this the systemjs output for legacy browsers
    legacy: false,
    preventLegacyModuleRequest: false,
    // Whether to inject babel polyfills (Object.assign, Promise, Array.prototype.some etc.)
    babelPolyfills: false,
    // Whether to inject webcomponentsjs polyfills. These are only added if on the legacy build
    webcomponentPolyfills: false,
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
    generateBundle(outputConfig) {
      if (!pluginConfig.legacy) {
        writeModules(pluginConfig, outputConfig);
      } else {
        writeLegacyModules(pluginConfig, outputConfig);
      }
    },
  };
};
