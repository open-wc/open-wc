import glob from 'glob';
import path from 'path';
import fs from 'fs';

export async function findPackageJson(_globString, root = process.cwd()) {
  const globString = path.join(root, _globString);

  return new Promise(resolve => {
    const packageJsonPaths = [];
    glob(globString, {}, (er, files) => {
      files.forEach(wsPackagePath => {
        if (fs.lstatSync(wsPackagePath).isDirectory()) {
          const packageJsonPath = path.join(wsPackagePath, 'package.json');
          if (fs.existsSync(packageJsonPath)) {
            packageJsonPaths.push(packageJsonPath);
          }
        }
      });
      resolve(packageJsonPaths);
    });
  });
}
