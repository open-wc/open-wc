import { compatibilityModes } from '../constants.js';

/**
 * @param {string} indexHTML
 * @param {{ inlineImportMaps: string[], importMapPaths: string[] }} data
 * @param {string} type
 * @returns {string}
 */
export function addPolyfilledImportMap(indexHTML, data, type) {
  let transformedIndexHTML = indexHTML;

  if (data.inlineImportMaps) {
    data.inlineImportMaps.forEach(importMap => {
      transformedIndexHTML = indexHTML.replace(
        '<head>',
        `<head>\n    <script type="${type}">${importMap}</script>\n`,
      );
    });
  }

  if (data.importMapPaths) {
    data.importMapPaths.forEach(importMapPath => {
      transformedIndexHTML = indexHTML.replace(
        '<head>',
        `<head>\n    <script type="${type}" src="${importMapPath}"></script>\n`,
      );
    });
  }

  return transformedIndexHTML;
}

/**
 * @param {string} baseIndexHTML
 * @param {string} compatibilityMode
 * @param {{ inlineImportMaps: string[], importMapPaths: string[] }} data
 */
export function addPolyfilledImportMaps(baseIndexHTML, compatibilityMode, data) {
  let indexHTML = baseIndexHTML;

  // no need to polyfill anything without compatibility mode
  if (compatibilityMode === compatibilityModes.NONE) {
    return indexHTML;
  }

  // add importmap-shim for use with es-module-shims
  indexHTML = addPolyfilledImportMap(indexHTML, data, 'importmap-shim');

  // if we need to support legacy browsers, also add systemjs-importmap
  if (compatibilityMode === compatibilityModes.ALL) {
    indexHTML = addPolyfilledImportMap(indexHTML, data, 'systemjs-importmap');
  }

  return indexHTML;
}
