// @ts-ignore
const { buildExternalHelpers, transformSync } = require('@babel/core');
const { getDependencies } = require('@babel/helpers');
const MagicString = require('magic-string');
const Terser = require('terser');
const fs = require('fs');

const HELPER_MODULE_NAME = '____babel-helpers____';
const supportedFormats = ['es', 'system'];
const modulePlugins = { system: '@babel/plugin-transform-modules-systemjs' };

function getEsHelperImport(ast) {
  return ast.body.find(
    node => node.type === 'ImportDeclaration' && node.source.value.startsWith(HELPER_MODULE_NAME),
  );
}

function getSystemHelperImport(ast) {
  const systemRegister = ast.body.find(node => {
    if (node.type === 'ExpressionStatement' && node.expression) {
      const { callee, type } = node.expression;
      if (type === 'CallExpression' && callee) {
        const { object, property } = node.expression.callee;
        return object && property && object.name === 'System' && property.name === 'register';
      }
    }
    return false;
  });

  if (!systemRegister) {
    return undefined;
  }

  return (
    Array.isArray(systemRegister.expression.arguments) &&
    systemRegister.expression.arguments[0].elements.find(n => n.value === HELPER_MODULE_NAME)
  );
}

function getHelperImportSpecifier(ast, format) {
  switch (format) {
    case 'es': {
      const importNode = getEsHelperImport(ast);
      return importNode && importNode.source;
    }
    case 'system':
      return getSystemHelperImport(ast);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function addHelperDependencies(allHelpers, helper) {
  if (helper === 'regeneratorRuntime') {
    return;
  }

  for (const dep of getDependencies(helper)) {
    if (!allHelpers.has(dep)) {
      allHelpers.add(dep);
      addHelperDependencies(allHelpers, dep);
    }
  }
}

function getHelpersWithDependencies(helpers) {
  const all = new Set(helpers);
  for (const helper of helpers) {
    addHelperDependencies(all, helper);
  }
  return Array.from(all);
}

function createHelperModule(helpers, format, minify) {
  const helpersWithDependencies = getHelpersWithDependencies(helpers);
  const addRegeneratorRuntime = helpersWithDependencies.includes('regeneratorRuntime');
  let helperSource = buildExternalHelpers(
    helpersWithDependencies.filter(h => h !== 'regeneratorRuntime'),
    'module',
  );

  if (addRegeneratorRuntime) {
    const runtimePath = require.resolve('regenerator-runtime/runtime.js');
    const runtimeCode = fs.readFileSync(runtimePath, 'utf-8');
    helperSource += `\nexport var regeneratorRuntime;\n\n(function () {${runtimeCode}})();\n`;
  }

  if (format !== 'es') {
    helperSource = transformSync(helperSource, {
      babelrc: false,
      configFile: false,
      sourceMaps: false,
      plugins: [require.resolve(modulePlugins[format])],
    }).code;
  }

  if (minify) {
    helperSource = Terser.minify(helperSource, {
      module: format === 'es',
      toplevel: format === 'es',
    }).code;
  }

  return helperSource;
}

function bundledBabelHelpers({ format = 'es', minify = true } = {}) {
  if (!supportedFormats.includes(format)) {
    throw new Error(`Unknown format: ${format}. Supported formats: ${supportedFormats}`);
  }

  // all the helpers that were used
  const totalHelpers = [];
  return {
    /** Collects used babel helper imports */
    renderChunk(code) {
      const helperImport = getEsHelperImport(this.parse(code));
      if (helperImport) {
        totalHelpers.push(...helperImport.specifiers.map(s => s.imported.name));
      }
      return null;
    },

    /**
     * Creates babel helpers chunk based on used helpers, and rewrites imports to the
     * babel helpers chunk using the hashed babel helpers filename.
     */
    generateBundle(_, bundle) {
      if (totalHelpers.length === 0) {
        return;
      }

      const helperModule = createHelperModule(totalHelpers, format, minify);
      const helperId = this.emitFile({
        name: 'babel-helpers.js',
        type: 'asset',
        source: helperModule,
      });
      const helperFileName = this.getFileName(helperId);

      const chunks = Object.values(bundle).filter(file => file.type === 'chunk');

      for (const chunk of chunks) {
        const importSpecifier = getHelperImportSpecifier(this.parse(chunk.code), format);
        if (importSpecifier) {
          const fileDepth = chunk.fileName.split('/').length - 1;
          const helperDir = fileDepth === 0 ? './' : '../'.repeat(fileDepth);
          const helperImport = `"${helperDir}${helperFileName}"`;
          // @ts-ignore
          const ms = new MagicString(chunk.code);
          ms.overwrite(importSpecifier.start, importSpecifier.end, helperImport);
          chunk.code = ms.toString();
        }
      }
    },
  };
}

module.exports = { bundledBabelHelpers, HELPER_MODULE_NAME };
