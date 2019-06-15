import path from 'path';
import fs from 'fs';
import { findPackageJson } from './findPackageJson';

async function findWorkspaceParentDeps(depName, packageJson, targetPath = process.cwd()) {
  const parents = [];
  if (packageJson.workspaces) {
    // eslint-disable-next-line no-restricted-syntax
    for (const globString of packageJson.workspaces) {
      // eslint-disable-next-line no-await-in-loop
      const packageJsonPaths = await findPackageJson(globString, targetPath);
      packageJsonPaths.forEach(packageJsonPath => {
        const packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');
        const wsPackageJson = JSON.parse(packageJsonString);
        if (wsPackageJson.dependencies && wsPackageJson.dependencies[depName]) {
          parents.push(wsPackageJson.name);
        }
      });
    }
  }
  return parents;
}

function findLocalParentDeps(depName, deps) {
  const parentDeps = [];
  Object.keys(deps).forEach(key => {
    const dep = deps[key];
    if (dep.dependencies && Object.keys(dep.dependencies).includes(depName)) {
      const currentDepName = key.slice(0, key.lastIndexOf('@'));
      parentDeps.push(currentDepName);
    }
  });
  return parentDeps;
}

async function findAllParentDeps(depName, deps, packageJson, targetPath = process.cwd()) {
  const parents = [
    ...findLocalParentDeps(depName, deps),
    ...(await findWorkspaceParentDeps(depName, packageJson, targetPath)),
  ];
  return parents;
}

function readJsonFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function findPathToVersion(
  depName,
  version,
  deps,
  packageJson,
  targetPath = process.cwd(),
) {
  let rootVersion = '';
  try {
    const rootVersionPath = require.resolve(`${depName}/package.json`, {
      paths: [targetPath],
    });
    rootVersion = readJsonFile(rootVersionPath).version;
  } catch (e) {
    // package could not be found
    return null;
  }

  if (rootVersion !== version) {
    const parents = await findAllParentDeps(depName, deps, packageJson, targetPath);

    for (let i = 0; i < parents.length; i += 1) {
      const parent = parents[i];
      const parentPath = require.resolve(parent, {
        paths: [targetPath],
      });
      const subVersionPath = require.resolve(`${depName}/package.json`, {
        paths: [parentPath],
      });
      const { version: subVersion } = readJsonFile(subVersionPath);
      if (subVersion === version) {
        const result = path.relative(targetPath, require.resolve(depName, { paths: [parentPath] }));
        return `/${result}`;
      }
    }

    // non of the available versions is the required one
    return null;
  }

  const result = path.relative(
    targetPath,
    require.resolve(depName, {
      paths: [targetPath],
    }),
  );
  return `/${result}`;
}
