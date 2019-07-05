import * as lockfile from '@yarnpkg/lockfile';
import path from 'path';
import fs from 'fs';
import prompts from 'prompts';
import { findProductionDependencies } from './findProductionDependencies';
import { flattenYarnLock } from './flattenYarnLock';
import { findPathToVersion } from './findPathToVersion';
import { findPackageJson } from './findPackageJson';
import { postProcessImportMap } from './postProcessImportMap';

async function askForVersionSelection(depName, versions) {
  const choices = [];
  versions.forEach(version => {
    choices.push({
      title: version,
      value: version,
    });
  });

  const answers = await prompts([
    {
      type: 'select',
      name: 'selectedVersion',
      message: `Could not find a version of ${depName} that can satisfy all dependencies. Which version would you like to use?`,
      choices,
    },
  ]);
  return answers.selectedVersion;
}

async function addWorkspaceDeps(flatResolvedDeps, packageJson, targetPath = process.cwd()) {
  const deps = flatResolvedDeps;
  if (packageJson.workspaces) {
    // eslint-disable-next-line no-restricted-syntax
    for (const globString of packageJson.workspaces) {
      // eslint-disable-next-line no-await-in-loop
      const packageJsonPaths = await findPackageJson(globString, targetPath);
      packageJsonPaths.forEach(packageJsonPath => {
        const packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');
        const wsPackageJson = JSON.parse(packageJsonString);
        const depName = wsPackageJson.name;

        const depPath = require.resolve(depName, {
          paths: [targetPath],
        });

        const result = `/${path.relative(targetPath, depPath)}`;
        deps[depName] = result;
      });
    }
  }
  return deps;
}

export function flatResolvedDepsToImports(deps) {
  const importMap = {};
  importMap.imports = {};

  Object.keys(deps).forEach(depName => {
    const depPath = deps[depName];
    importMap.imports[depName] = depPath;
    importMap.imports[`${depName}/`] = `${path.dirname(depPath)}/`;
  });
  return importMap;
}

function updatePackageJsonResolutions(depName, selectedVersion, packageJson, targetPath) {
  // we need to do it like this as we do not want to override the order in the package.json
  const newPackageJson = { ...packageJson };
  newPackageJson.importMap = newPackageJson.importMap ? newPackageJson.importMap : {};
  newPackageJson.importMap.resolutions = newPackageJson.importMap.resolutions
    ? newPackageJson.importMap.resolutions
    : {};
  newPackageJson.importMap.resolutions[depName] = selectedVersion;
  fs.writeFileSync(
    path.resolve(targetPath, 'package.json'),
    JSON.stringify(newPackageJson, null, 2),
  );
}

export async function resolvePathsAndConflicts(
  flatDeps,
  deps,
  packageJson = {},
  targetPath = process.cwd(),
) {
  const resolvedDeps = {};

  const resolveMap =
    packageJson.importMap && packageJson.importMap.resolutions
      ? packageJson.importMap.resolutions
      : {};

  // eslint-disable-next-line no-restricted-syntax
  for (const depName of Object.keys(flatDeps)) {
    const depData = flatDeps[depName];
    if (Array.isArray(depData)) {
      let pathToPackage = null;
      if (Object.keys(resolveMap).includes(depName)) {
        // eslint-disable-next-line no-await-in-loop
        pathToPackage = await findPathToVersion(
          depName,
          resolveMap[depName],
          deps,
          packageJson,
          targetPath,
        );
      }
      if (!pathToPackage) {
        // eslint-disable-next-line no-await-in-loop
        const selectedVersion = await askForVersionSelection(depName, depData);
        // eslint-disable-next-line no-await-in-loop
        pathToPackage = await findPathToVersion(
          depName,
          selectedVersion,
          deps,
          packageJson,
          targetPath,
        );
        updatePackageJsonResolutions(depName, selectedVersion, packageJson, targetPath);
      }

      resolvedDeps[depName] = pathToPackage;
    } else {
      const depPath = require.resolve(depName, {
        paths: [targetPath],
      });

      const result = `/${path.relative(targetPath, depPath)}`;
      resolvedDeps[depName] = result;
    }
  }
  return resolvedDeps;
}

export async function generateFromYarnLock(
  yarnLockString,
  packageJson,
  targetPath = process.cwd(),
) {
  const yarnLock = lockfile.parse(yarnLockString);

  const deps = await findProductionDependencies(yarnLock.object, packageJson, targetPath);
  const flatDeps = flattenYarnLock(deps);
  const flatResolvedDeps = await resolvePathsAndConflicts(flatDeps, deps, packageJson, targetPath);

  const flatResolvedDepsWithWorkspaceDeps = await addWorkspaceDeps(
    flatResolvedDeps,
    packageJson,
    targetPath,
  );

  let imports = flatResolvedDepsToImports(flatResolvedDepsWithWorkspaceDeps);
  imports = postProcessImportMap(imports, packageJson);

  return imports;
}
