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

async function buildManager(outputDir, assets) {
  const configs = createCompatibilityConfig({
    input: 'noop',
    outputDir,
    plugins: { indexHTML: false },
  });

  configs[0].onwarn = onwarn;
  configs[1].onwarn = onwarn;
  configs[0].output.dir = path.join(outputDir, 'legacy');
  configs[1].output.dir = outputDir;

  configs[0].plugins.unshift(
    indexHTML({
      indexFilename: 'index.html',
      indexHTMLString: assets.indexHTML,
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
      indexFilename: 'index.html',
      indexHTMLString: assets.indexHTML,
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
    copyCustomElementsJsonPlugin(outputDir),
  );

  // build sequentially instead of parallel because terser is multi
  // threaded and will max out CPUs.
  await rollupBuild(configs[0]);
  await rollupBuild(configs[1]);
}

async function buildPreview({ outputDir, assets, storyFiles, rollupConfigDecorator }) {
  const transformMdxToJs = createMdxToJsTransformer();
  let configs = createCompatibilityConfig({
    input: 'noop',
    outputDir,
    extensions: [...DEFAULT_EXTENSIONS, 'mdx'],
    plugins: { indexHTML: false },
  });

  const transformMdxPlugin = {
    transform(code, id) {
      if (id.endsWith('.mdx')) {
        return transformMdxToJs(id, code);
      }
      return null;
    },
  };

  configs[0].onwarn = onwarn;
  configs[1].onwarn = onwarn;
  configs[0].output.dir = path.join(outputDir, 'legacy');
  configs[1].output.dir = outputDir;

  configs[0].plugins.unshift(
    indexHTML({
      indexFilename: 'iframe.html',
      indexHTMLString: assets.iframeHTML,
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
    transformMdxPlugin,
    injectOrderedExportsPlugin(storyFiles),
    copyCustomElementsJsonPlugin(outputDir),
  );

  configs[1].plugins.unshift(
    indexHTML({
      indexFilename: 'iframe.html',
      indexHTMLString: assets.iframeHTML,
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
  storyFiles,
  storyUrls,
  rollupConfigDecorator,
}) {
  const managerPathRelative = `/${path.relative(process.cwd(), require.resolve(managerPath))}`;
  const managerImport = toBrowserPath(managerPathRelative);

  const assets = createAssets({
    storybookConfigDir,
    rootDir: process.cwd(),
    previewImport: previewPath,
    managerImport,
    storyUrls,
  });

  await fs.remove(outputDir);
  await fs.mkdirp(outputDir);

  await buildManager(outputDir, assets);
  await buildPreview({ outputDir, assets, storyFiles, rollupConfigDecorator });
};
