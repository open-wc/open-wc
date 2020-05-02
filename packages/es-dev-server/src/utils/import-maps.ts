export function addPolyfilledImportMaps(
  indexHTML: string,
  data: { inlineImportMaps: string[]; importMapPaths: string[] },
) {
  let transformedIndexHTML = indexHTML;

  if (data.inlineImportMaps) {
    data.inlineImportMaps.forEach(importMap => {
      transformedIndexHTML = indexHTML.replace(
        '<head>',
        `<head>\n    <script type="systemjs-importmap">${importMap}</script>\n`,
      );
    });
  }

  if (data.importMapPaths) {
    data.importMapPaths.forEach(importMapPath => {
      transformedIndexHTML = indexHTML.replace(
        '<head>',
        `<head>\n    <script type="systemjs-importmap" src="${importMapPath}"></script>\n`,
      );
    });
  }

  return transformedIndexHTML;
}
