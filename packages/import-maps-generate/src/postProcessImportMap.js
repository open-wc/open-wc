export function postProcessImportMap(imports, packageJson) {
  let importmap = imports;
  if (typeof packageJson.importmap !== 'undefined') {
    if (typeof packageJson.importmap.overrides !== 'undefined') {
      const { overrides } = packageJson.importmap;
      importmap = { ...importmap, ...overrides };
    }

    if (typeof packageJson.importmap.deletes !== 'undefined') {
      const { deletes } = packageJson.importmap;

      Object.values(deletes).forEach(dependency => {
        delete importmap.imports[dependency];
      });
    }
  }
  return importmap;
}
