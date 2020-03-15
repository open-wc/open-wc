const { parse } = require('es-module-lexer');

/**
 * @param {string} code
 * @param {string} replacement
 * @param {number} start
 * @param {number} end
 * @return {string} String with replaced content
 */
function replaceCode(code = '', replacement, start, end) {
  const before = code.substring(0, start);
  const after = code.substring(end);
  return `${before}${replacement}${after}`;
}

/**
 *
 * @param {string} pkgImport
 * @param {string} fallbackName
 */
function getPkgMetaFromImport(pkgImport, fallbackName = '') {
  if (pkgImport.startsWith('./')) {
    return {
      name: fallbackName,
      path: pkgImport.substring(1),
    };
  }

  let scope = '';
  let name = '';
  let path = '';
  if (pkgImport.startsWith('@')) {
    const parts = pkgImport.split('/');
    scope = parts.shift();
    name = parts.shift();
    if (parts.length > 0) {
      path = `/${parts.join('/')}`;
    }
    name = `${scope}/${name}`;
  } else {
    const parts = pkgImport.split('/');
    name = parts.shift();
    if (parts.length > 0) {
      path = `/${parts.join('/')}`;
    }
  }
  return { name, path };
}

/**
 *
 * @param {string} code
 * @param {object} pkgJson
 */
async function resolveToUnpkg(code, pkgJson = {}) {
  const [imports] = await parse(code);

  const versions = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
  };
  if (pkgJson.name && pkgJson.version) {
    versions[pkgJson.name] = pkgJson.version;
  }

  let result = code;
  for (const importMeta of imports.reverse()) {
    const importPath = code.substring(importMeta.s, importMeta.e);
    if (!importPath.startsWith('http')) {
      const pkgMeta = getPkgMetaFromImport(importPath, pkgJson.name);
      const version = versions[pkgMeta.name];
      let newImport = `https://unpkg.com/${pkgMeta.name}${pkgMeta.path}?module`;
      if (version) {
        newImport = `https://unpkg.com/${pkgMeta.name}@${version}${pkgMeta.path}?module`;
      }
      result = replaceCode(result, newImport, importMeta.s, importMeta.e);
    }
  }

  return result;
}

module.exports = {
  resolveToUnpkg,
};
