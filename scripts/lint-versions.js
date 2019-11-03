/* eslint-disable no-console */
const { readdirSync, existsSync, readFileSync } = require('fs');

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(pathMeta => pathMeta.isDirectory())
    .map(pathMeta => pathMeta.name);

function readPackageJson(filePath) {
  if (existsSync(filePath)) {
    const jsonData = JSON.parse(readFileSync(filePath, 'utf-8'));
    const merged = { ...jsonData.dependencies, ...jsonData.devDependencies };
    const result = {};
    Object.keys(merged).forEach(dep => {
      if (merged[dep] && !merged[dep].includes('file:')) {
        result[dep] = merged[dep];
      }
    });
    return result;
  }
  return {};
}

function compareVersions(versionsA, versionsB) {
  let output = '';
  const newVersions = { ...versionsA };
  Object.keys(versionsB).forEach(dep => {
    if (versionsA[dep] && versionsB[dep] && versionsA[dep] !== versionsB[dep]) {
      output += `  - "${dep}": "${versionsA[dep]}" !== "${versionsB[dep]}"\n`;
    }
    if (!newVersions[dep]) {
      newVersions[dep] = versionsB[dep];
    }
  });

  return {
    output,
    newVersions,
  };
}

let currentVersions = readPackageJson('./package.json');
let endReturn = 0;
getDirectories('./packages').forEach(subPackage => {
  const filePath = `./packages/${subPackage}/package.json`;
  const subPackageVersions = readPackageJson(filePath);
  const { output, newVersions } = compareVersions(currentVersions, subPackageVersions);
  currentVersions = { ...newVersions };
  if (output) {
    console.log(`Version mismatches found in "${filePath}":`);
    console.log(output);
    console.log();
    endReturn = 1;
  }
});

process.exit(endReturn);
