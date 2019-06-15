export function postProcessImportMap(imports, packageJson) {
  const importMap = imports;

  if (typeof packageJson.importMap !== 'undefined') {
    if (typeof packageJson.importMap.overrides !== 'undefined') {
      // override imports
      if (typeof packageJson.importMap.overrides.imports !== 'undefined') {
        const importOverrides = packageJson.importMap.overrides.imports;
        importMap.imports = { ...importMap.imports, ...importOverrides };
      }

      // override scopes
      if (typeof packageJson.importMap.overrides.scopes !== 'undefined') {
        const { scopes } = packageJson.importMap.overrides;
        importMap.scopes = { ...importMap.scopes, ...scopes };
      }
    }

    if (typeof packageJson.importMap.deletes !== 'undefined') {
      // delete imports
      if (typeof packageJson.importMap.deletes.imports !== 'undefined') {
        const importsToDelete = packageJson.importMap.deletes.imports;

        Object.values(importsToDelete).forEach(dependency => {
          delete importMap.imports[dependency];
        });
      }

      // delete scopes
      if (typeof packageJson.importMap.deletes.scopes !== 'undefined') {
        const scopesToDelete = packageJson.importMap.deletes.scopes;

        Object.values(scopesToDelete).forEach(dependency => {
          delete importMap.scopes[dependency];
        });
      }

      // delete imports of a scope
      if (typeof packageJson.importMap.deletes.scopeImports !== 'undefined') {
        const scopeImportsToDelete = packageJson.importMap.deletes.scopeImports;

        Object.keys(scopeImportsToDelete).forEach(scope => {
          scopeImportsToDelete[scope].forEach(item => {
            delete importMap.scopes[scope][item];
          });

          if (Object.values(importMap.scopes[scope]).length === 0) {
            delete importMap.scopes[scope];
          }
        });
      }
    }
  }
  return importMap;
}
