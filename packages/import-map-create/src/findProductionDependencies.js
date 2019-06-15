import fs from 'fs';
import { findPackageJson } from './findPackageJson';

export async function findWorkspaceProdutionDependenies(packageJson, root = process.cwd()) {
  let deps = packageJson.dependencies ? packageJson.dependencies : {};
  if (packageJson.workspaces) {
    // eslint-disable-next-line no-restricted-syntax
    for (const globString of packageJson.workspaces) {
      // eslint-disable-next-line no-await-in-loop
      const packageJsonPaths = await findPackageJson(globString, root);
      // eslint-disable-next-line no-loop-func
      packageJsonPaths.forEach(packageJsonPath => {
        const packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');
        const wsPackageJson = JSON.parse(packageJsonString);
        deps = {
          ...deps,
          ...wsPackageJson.dependencies,
        };
      });
    }
  }

  const finalDeps = {};
  Object.keys(deps).forEach(depName => {
    finalDeps[depName] = true;
  });

  return finalDeps;
}

/**
 *
 * @param {*} deps
 * @param {*} packageJson
 */
export async function findProductionDependencies(deps, packageJson, targetPath = process.cwd()) {
  const prodDeps = await findWorkspaceProdutionDependenies(packageJson, targetPath);

  let redo = false;
  do {
    let requestRedo = false;
    Object.keys(deps).forEach(key => {
      const depName = key.slice(0, key.lastIndexOf('@'));

      if (prodDeps[depName]) {
        const value = deps[key];
        if (value.dependencies) {
          Object.keys(value.dependencies).forEach(newDep => {
            if (!prodDeps[newDep]) {
              prodDeps[newDep] = value.dependencies[newDep];
              requestRedo = true;
            }
          });
        }
      }
    });

    redo = !!requestRedo;
  } while (redo === true);

  // we now know all production dependencies - one more pass to gather them
  const result = {};
  Object.keys(deps).forEach(key => {
    const depName = key.slice(0, key.lastIndexOf('@'));
    if (prodDeps[depName]) {
      result[key] = deps[key];
    }
  });

  return result;
}
