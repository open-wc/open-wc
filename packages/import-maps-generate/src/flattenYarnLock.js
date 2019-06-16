import semver from 'semver';

function findNestedDeps(deps) {
  const flatDeps = {};
  Object.keys(deps).forEach(dep => {
    const depName = dep.slice(0, dep.lastIndexOf('@'));
    const range = dep.slice(dep.lastIndexOf('@') + 1);
    const depData = deps[dep];
    if (!flatDeps[depName]) {
      flatDeps[depName] = {
        versions: [],
        ranges: [],
      };
    }
    flatDeps[depName].versions.push(depData.version);
    flatDeps[depName].ranges.push(range);
  });
  return flatDeps;
}

function findBestVersion(ranges, versions) {
  let bestVersion = false;
  versions.forEach(version => {
    if (ranges.every(range => semver.satisfies(version, range))) {
      bestVersion = version;
    }
  });

  return bestVersion || versions;
}

export function flattenYarnLock(deps) {
  const nestedDeps = findNestedDeps(deps);
  const flatDeps = {};
  Object.keys(nestedDeps).forEach(dep => {
    const depData = nestedDeps[dep];
    flatDeps[dep] = findBestVersion(depData.ranges, depData.versions);
  });
  return flatDeps;
}
