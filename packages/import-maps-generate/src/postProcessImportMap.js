export function postProcessImportMap(imports, packageJson) {
  const importmap = imports;

  if (typeof packageJson.importmap !== 'undefined') {
    if (typeof packageJson.importmap.overrides !== 'undefined') {
      // override imports
      if (typeof packageJson.importmap.overrides.imports !== 'undefined') {
        const importOverrides = packageJson.importmap.overrides.imports;
        importmap.imports = { ...importmap.imports, ...importOverrides };
      }

      // override scopes
      if (typeof packageJson.importmap.overrides.scopes !== 'undefined') {
        const { scopes } = packageJson.importmap.overrides;
        importmap.scopes = { ...importmap.scopes, ...scopes };
      }
    }

    if (typeof packageJson.importmap.deletes !== 'undefined') {
      // delete imports
      if (typeof packageJson.importmap.deletes.imports !== 'undefined') {
        const importsToDelete = packageJson.importmap.deletes.imports;

        Object.values(importsToDelete).forEach(dependency => {
          delete importmap.imports[dependency];
        });
      }

      // delete scopes
      if (typeof packageJson.importmap.deletes.scopes !== 'undefined') {
        const scopesToDelete = packageJson.importmap.deletes.scopes;

        Object.values(scopesToDelete).forEach(dependency => {
          delete importmap.scopes[dependency];
        });
      }

      // delete imports of a scope
      if (typeof packageJson.importmap.deletes.scopeImports !== 'undefined') {
        const scopeImportsToDelete = packageJson.importmap.deletes.scopeImports;

        Object.keys(scopeImportsToDelete).forEach(scope => {
          scopeImportsToDelete[scope].forEach(item => {
            delete importmap.scopes[scope][item];
          });

          if (Object.values(importmap.scopes[scope]).length === 0) {
            delete importmap.scopes[scope];
          }
        });
      }
    }
  }
  return importmap;
}
