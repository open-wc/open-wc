/** @typedef {import('./src/types').ImportMap} ImportMap */
/** @typedef {import('./src/types').ScopesMap} ScopesMap */
/** @typedef {import('./src/types').SpecifierMap} SpecifierMap */
/** @typedef {import('./src/types').ParsedImportMap} ParsedImportMap */
/** @typedef {import('./src/types').ParsedScopesMap} ParsedScopesMap */
/** @typedef {import('./src/types').ParsedSpecifierMap} ParsedSpecifierMap */

const { parseFromString, parse } = require('./src/parser.js');
const { resolve } = require('./src/resolver.js');

module.exports = { parseFromString, parse, resolve };
