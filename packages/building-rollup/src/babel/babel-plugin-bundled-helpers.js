const { types } = require('@babel/core');
const { HELPER_MODULE_NAME } = require('./rollup-plugin-bundled-babel-helpers.js');

/**
 * Babel plugin which imports babel helpers from a helper module.
 */
const babelPluginBundledHelpers = {
  name: 'bundled-helpers',

  pre(file) {
    file.set('helperGenerator', name => this.addOrGetNamedImport(name, true));

    const identifiersCache = new Map();
    let importDeclaration;

    this.addOrGetNamedImport = (name, prefixName) => {
      let identifier = identifiersCache.get(name);
      if (!identifier) {
        identifier = types.identifier(prefixName ? `__${name}__` : name);
        const importIdentifier = types.identifier(name);
        identifiersCache.set(name, identifier);

        if (!importDeclaration) {
          importDeclaration = types.importDeclaration([], types.stringLiteral(HELPER_MODULE_NAME));
          file.path.unshiftContainer('body', importDeclaration);
        }

        importDeclaration.specifiers.push(types.importSpecifier(identifier, importIdentifier));
      } else {
        identifier = types.cloneNode(identifier);
      }

      return identifier;
    };
  },

  visitor: {
    ReferencedIdentifier(path) {
      const { node } = path;
      const { name } = node;

      if (name === 'regeneratorRuntime') {
        path.replaceWith(this.addOrGetNamedImport('regeneratorRuntime', true));
      }
    },
  },
};

module.exports = { babelPluginBundledHelpers };
