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
      message: `Could not find compatible versions for ${depName}. Which one to choose?`,
      choices,
    },
  ]);
  return answers.selectedVersion;
}

async function addWorkspaceDeps(flatResolvedDeps, packageJson, targetPath = process.cwd()) {
  const deps = flatResolvedDeps;
  if (packageJson.workspaces) {
    for (const globString of packageJson.workspaces) {
      const packageJsonPaths = await findPackageJson(globString, targetPath);
      packageJsonPaths.forEach(packageJsonPath => {
        const packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');
        const wsPackageJson = JSON.parse(packageJsonString);
        const depName = wsPackageJson.name;

        const depPath = require.resolve(depName, {
          paths: [targetPath],
        });

        const result = `/${  path.relative(targetPath, depPath)}`;
        deps[depName] = result;
      });
    }
  }
  return deps;
}

export function flatResolvedDepsToImports(deps) {
  const imports = {};
  Object.keys(deps).forEach(depName => {
    const depPath = deps[depName];
    imports[depName] = depPath;
    imports[`${depName  }/`] = `${path.dirname(depPath)  }/`;
  });
  return imports;
}

export async function resolvePathsAndConflicts(
  flatDeps,
  deps,
  resolveMap = {},
  packageJson = {},
  targetPath = process.cwd(),
) {
  const resolvedDeps = {};

  for (const depName of Object.keys(flatDeps)) {
    const depData = flatDeps[depName];
    if (Array.isArray(depData)) {
      const selectedVersion = Object.keys(resolveMap).includes(depName)
        ? resolveMap[depName]
        : await askForVersionSelection(depName, depData);
      resolvedDeps[depName] = await findPathToVersion(
        depName,
        selectedVersion,
        deps,
        packageJson,
        targetPath,
      );
    } else {
      const depPath = require.resolve(depName, {
        paths: [targetPath],
      });

      const result = `/${  path.relative(targetPath, depPath)}`;
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
  const importMapResolutions = packageJson.importMapResolutions
    ? packageJson.importMapResolutions
    : {};
  const flatResolvedDeps = await resolvePathsAndConflicts(
    flatDeps,
    deps,
    importMapResolutions,
    packageJson,
    targetPath,
  );

  const flatResolvedDepsWithWorkspaceDeps = await addWorkspaceDeps(
    flatResolvedDeps,
    packageJson,
    targetPath,
  );

  let imports = flatResolvedDepsToImports(flatResolvedDepsWithWorkspaceDeps, targetPath);
  imports = postProcessImportMap(imports, packageJson);

  return { imports };
}
