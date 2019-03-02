import path from 'path';
import mkdirp from 'mkdirp';
import { copyFileSync, existsSync } from 'fs';
import { query, queryAll, predicates, getAttribute, append, remove } from 'dom5';
import {
  readHTML,
  writeOutputHTML,
  createElement,
  createScript,
  createScriptModule,
} from './utils.js';

const prefix = '[rollup-plugin-legacy-browsers]:';
let writtenModules = false;
let writtenLegacyModules = false;
let inputPaths;
let inputPath;

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

function copyPolyfills(pluginConfig, outputConfig) {
  if (
    !pluginConfig.polyfillDynamicImports &&
    !pluginConfig.polyfillWebcomponents &&
    !pluginConfig.polyfillBabel
  ) {
    return;
  }
  const polyfillsDir = `${outputConfig.dir.replace('/legacy', '')}/polyfills`;
  mkdirp.sync(polyfillsDir);

  if (pluginConfig.polyfillDynamicImports) {
    copyFileSync(
      path.resolve('./src/dynamic-import-polyfill.js'),
      `${polyfillsDir}/dynamic-import-polyfill.js`,
    );
  }

  if (pluginConfig.polyfillWebcomponents) {
    copyFileSync(
      require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
      `${polyfillsDir}/webcomponent-polyfills.js`,
    );
  }

  if (pluginConfig.polyfillBabel) {
    copyFileSync(
      require.resolve('@babel/polyfill/browser.js'),
      `${polyfillsDir}/babel-polyfills.js`,
    );
  }
}

// Writes module scripts to output HTML file and copy necessary polyfills.
function writeModules(pluginConfig, outputConfig) {
  const indexHTML = getOutputHTML(outputConfig.dir);
  const head = query(indexHTML, predicates.hasTagName('head'));
  const body = query(indexHTML, predicates.hasTagName('body'));

  if (pluginConfig.polyfillDynamicImports) {
    // Feature detect dynamic import in a separate script, because browsers which don't
    // support it will throw a syntax error and stop executing the module
    append(body, createScriptModule('window.importModule=src=>import(src);'));

    // The actual loading script. Loads web components and dynamic import polyfills if necessary, then
    // loads the user's modules
    append(
      body,
      createScriptModule(`
      (async () => {
        const p = [];
        if (!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)) {p.push('./polyfills/webcomponent-polyfills.js');}
        if (!window.importModule) {p.push('./polyfills/dynamic-import-polyfill.js');}
        if (p.length > 0) {await Promise.all(p.map(p => new Promise((rs, rj) => {const s = document.createElement('script');s.src = p;s.onerror = () => rj(\`Failed to load \${s.s}\`);s.onload = () => rs();document.head.appendChild(s);})));}
        ${inputPaths.map(src => `importModule('${src}');`)}
      })();
    `),
    );

    // Because the module is loaded after some js execution, add preload hints so that it is downloaded
    // from the start
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
      append(body, createScript({ type: 'module', src }));
    });
  }

  writeOutputHTML(outputConfig.dir, indexHTML);
}

// browsers which don't support es modules also don't support es2015 and web components
// for those browsers we load a systemjs build, including:
// - es5 code
// - babel polyfills
// - web component polyfills (no feature detection needed)
// - systemjs loader for modules
function writeLegacyModules(pluginConfig, outputConfig) {
  const legacyOutputDir = outputConfig.dir;
  const outputDir = legacyOutputDir.replace('/legacy', '');
  const indexHTML = getOutputHTML(outputDir);

  const body = query(indexHTML, predicates.hasTagName('body'));
  const polyfillsDir = `${outputDir}/polyfills`;
  mkdirp.sync(polyfillsDir);

  if (pluginConfig.polyfillBabel) {
    append(
      body,
      createScript({
        src: `./polyfills/babel-polyfills.js`,
        nomodule: '',
      }),
    );
  }

  if (pluginConfig.polyfillWebcomponents) {
    append(
      body,
      createScript({
        src: `./polyfills/webcomponent-polyfills.js`,
        nomodule: '',
      }),
    );
  }

  copyFileSync(require.resolve('systemjs/dist/s.min.js'), `${polyfillsDir}/system-loader.js`);
  append(
    body,
    createScript({
      src: `./polyfills/system-loader.js`,
      nomodule: '',
    }),
  );

  const loadScript = createScript(
    { nomodule: '' },
    inputPaths.map(src => `System.import('./${path.join('legacy', src)}');`).join(''),
  );
  append(body, loadScript);
  writeOutputHTML(outputDir, indexHTML);
}

export default (_pluginConfig = {}) => {
  const pluginConfig = {
    // Whether this the systemjs output for legacy browsers
    legacy: false,
    polyfillDynamicImports: false,
    // Whether to inject babel polyfills (Object.assign, Promise, Array.prototype.some etc.)
    polyfillBabel: false,
    // Whether to inject webcomponentsjs polyfills. These are only added if on the legacy build
    polyfillWebcomponents: false,
    ..._pluginConfig,
  };

  return {
    name: 'modern-web',

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
      if (!pluginConfig.legacy && !writtenModules) {
        copyPolyfills(pluginConfig, outputConfig);
        writeModules(pluginConfig, outputConfig);
        writtenModules = true;
      } else if (!writtenLegacyModules) {
        copyPolyfills(pluginConfig, outputConfig);
        writeLegacyModules(pluginConfig, outputConfig);
        writtenLegacyModules = true;
      }
    },
  };
};
