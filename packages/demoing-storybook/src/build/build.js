const { rollup } = require('rollup');
const { createCompatibilityConfig } = require('@open-wc/building-rollup');
const { DEFAULT_EXTENSIONS } = require('@babel/core');
const indexHTML = require('rollup-plugin-index-html');
const fs = require('fs-extra');
const path = require('path');
const MagicString = require('magic-string');
const createMdxToJsTransformer = require('../shared/createMdxToJsTransformer');
const { createOrderedExports } = require('../shared/createOrderedExports');
const createAssets = require('../shared/getAssets');
const listFiles = require('../shared/listFiles');
const toBrowserPath = require('../shared/toBrowserPath');
const { injectStories } = require('../shared/injectStories');

const injectOrderedExportsPlugin = storyFiles => ({
  async transform(code, id) {
    if (storyFiles.includes(id)) {
      const orderedExports = await createOrderedExports(code);
      if (!orderedExports) {
        return null;
      }

      // @ts-ignore
      const ms = new MagicString(code);
      ms.append(`\n\n${orderedExports}`);

      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true }),
      };
    }
    return null;
  },
});

function copyCustomElementsJsonPlugin(outputRootDir) {
  return {
    async generateBundle() {
      const files = await listFiles(
        `{,!(node_modules|web_modules|bower_components|${outputRootDir})/**/}custom-elements.json`,
        process.cwd(),
      );

      for (const file of files) {
        const destination = file.replace(process.cwd(), '');

        this.emitFile({
          type: 'asset',
          fileName: destination.substring(1, destination.length),
          source: fs.readFileSync(file, 'utf-8'),
        });
      }
    },
  };
}

async function rollupBuild(config) {
  const bundle = await rollup(config);
  await bundle.write(config.output);
}

const ignoredWarnings = ['EVAL', 'THIS_IS_UNDEFINED'];

function onwarn(warning, warn) {
  if (ignoredWarnings.includes(warning.code)) {
    return;
  }
  warn(warning);
}

const prebuiltDir = require.resolve('storybook-prebuilt/package.json').replace('/package.json', '');
const litHtmlDir = require.resolve('lit-html/package.json').replace('/package.json', '');

function createRollupConfigs({ outputDir, indexFilename, indexHTMLString }) {
  const configs = createCompatibilityConfig({
    input: 'noop',
    outputDir,
    extensions: [...DEFAULT_EXTENSIONS, 'mdx'],
    // exclude storybook-prebuilt from babel, it's already built
    // for some reason the babel exclude requires the entire file path prefix
    babelExclude: `${prebuiltDir}/**`,
    terserExclude: ['storybook-*'],
    plugins: { indexHTML: false },
  });

  function manualChunks(id) {
    // force storybook into it's own chunk so that we can skip minifying and babel it
    if (id.startsWith(prebuiltDir)) {
      return 'storybook';
    }
    // we don't want to include lit-html into the chunk with storybook, because then it will
    // not be minified
    if (id.startsWith(litHtmlDir)) {
      return 'lit-html';
    }
    return null;
  }
  configs[0].manualChunks = manualChunks;
  configs[1].manualChunks = manualChunks;

  configs[0].onwarn = onwarn;
  configs[1].onwarn = onwarn;
  configs[0].output.dir = path.join(outputDir, 'legacy');
  configs[1].output.dir = outputDir;

  configs[0].plugins.unshift(
    indexHTML({
      indexFilename,
      indexHTMLString,
      multiBuild: true,
      legacy: true,
      polyfills: {
        dynamicImport: true,
        coreJs: true,
        regeneratorRuntime: true,
        webcomponents: true,
        systemJs: true,
        fetch: true,
      },
    }),
  );

  configs[1].plugins.unshift(
    indexHTML({
      indexFilename,
      indexHTMLString,
      multiBuild: true,
      legacy: false,
      polyfills: {
        dynamicImport: true,
        coreJs: true,
        regeneratorRuntime: true,
        webcomponents: true,
        systemJs: true,
        fetch: true,
      },
    }),
  );
  return configs;
}

async function buildManager({ outputDir, assets }) {
  const configs = createRollupConfigs({
    outputDir,
    indexFilename: 'index.html',
    indexHTMLString: assets.indexHTML,
  });

  // build sequentially instead of parallel because terser is multi
  // threaded and will max out CPUs.
  await rollupBuild(configs[0]);
  await rollupBuild(configs[1]);
}

async function buildPreview({
  outputDir,
  assets: { iframeHTML },
  previewImport,
  previewConfigImport,
  storiesPatterns,
  rollupConfigDecorator,
}) {
  const { html, storyFiles } = await injectStories({
    iframeHTML,
    previewImport,
    previewConfigImport,
    storiesPatterns,
    absolutePath: false,
    rootDir: process.cwd(),
  });

  const transformMdxToJs = createMdxToJsTransformer();
  let configs = createRollupConfigs({
    outputDir,
    indexFilename: 'iframe.html',
    indexHTMLString: html,
  });

  const transformMdxPlugin = {
    transform(code, id) {
      if (id.endsWith('.mdx')) {
        return transformMdxToJs(id, code);
      }
      return null;
    },
  };

  configs[0].plugins.unshift(
    transformMdxPlugin,
    injectOrderedExportsPlugin(storyFiles),
    copyCustomElementsJsonPlugin(outputDir),
  );

  configs[1].plugins.unshift(
    transformMdxPlugin,
    injectOrderedExportsPlugin(storyFiles),
    copyCustomElementsJsonPlugin(outputDir),
  );

  if (rollupConfigDecorator) {
    configs = rollupConfigDecorator(configs) || configs;
  }

  // build sequentially instead of parallel because terser is multi
  // threaded and will max out CPUs.
  await rollupBuild(configs[0]);
  await rollupBuild(configs[1]);
}

module.exports = async function build({
  storybookConfigDir,
  outputDir,
  managerPath,
  previewPath,
  storiesPatterns,
  rollupConfigDecorator,
}) {
  const managerPathRelative = `/${path.relative(process.cwd(), require.resolve(managerPath))}`;
  const managerImport = `./${toBrowserPath(managerPathRelative)}`;

  const assets = createAssets({
    rootDir: process.cwd(),
    storybookConfigDir,
    managerImport,
    absoluteImports: false,
  });

  const previewConfigPath = path.join(storybookConfigDir, 'preview.js');
  const previewConfigImport = fs.existsSync(path.join(process.cwd(), previewConfigPath))
    ? `./${toBrowserPath(previewConfigPath)}`
    : undefined;
  const relativePreviewPath = path.relative(process.cwd(), previewPath);
  const previewImport = `./${toBrowserPath(relativePreviewPath)}`;

  await fs.remove(outputDir);
  await fs.mkdirp(outputDir);

  await buildManager({ outputDir, assets });
  await buildPreview({
    outputDir,
    assets,
    storiesPatterns,
    previewImport,
    previewConfigImport,
    rollupConfigDecorator,
  });
};
