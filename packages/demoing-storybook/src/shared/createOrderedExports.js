// @ts-ignore
const { parse } = require('es-module-lexer');

/**
 * Creates an export containing the module exports in the order that they appear
 * in the source code. This is needed because module objects don't preserve their
 * export order, while objects do. The order is needed to display the stories
 * correctly ordered in the sidebar menu.
 *
 * @param {string} source
 * @returns {Promise<string>}
 */
async function createOrderedExports(source) {
  const result = await parse(source);

  if (result[1].includes('__namedExportsOrder')) {
    return null;
  }

  const orderedExports = result[1].filter(e => e !== 'default');
  const exportsArray = `['${orderedExports.join("', '")}']`;

  return `export const __namedExportsOrder = ${exportsArray};`;
}

module.exports = { createOrderedExports };
