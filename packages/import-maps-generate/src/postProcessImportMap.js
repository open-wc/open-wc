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

    if (typeof packageJson.importMap.deletions !== 'undefined') {
      // delete imports
      if (typeof packageJson.importMap.deletions.imports !== 'undefined') {
        const importsToDelete = packageJson.importMap.deletions.imports;

        Object.values(importsToDelete).forEach(dependency => {
          delete importMap.imports[dependency];
        });
      }

      // delete scopes
      if (typeof packageJson.importMap.deletions.scopes !== 'undefined') {
        const scopesToDelete = packageJson.importMap.deletions.scopes;

        Object.values(scopesToDelete).forEach(dependency => {
          delete importMap.scopes[dependency];
        });
      }

      // delete imports of a scope
      if (typeof packageJson.importMap.deletions.scopeImports !== 'undefined') {
        const scopeImportsToDelete = packageJson.importMap.deletions.scopeImports;

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
