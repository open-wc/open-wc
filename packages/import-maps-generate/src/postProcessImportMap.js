function processResolutionName(res) {
  if(res.includes('node_modules')) return res.split('/node_modules/')[1].split('/')[0];
  return res;
}

export function postProcessImportMap(imports, packageJson) {
  const importmap = imports;
  if(typeof packageJson.importmap !== 'undefined' && typeof packageJson.importmap.overrides !== 'undefined') {
    const { overrides } = packageJson.importmap;

    Object.keys(overrides).forEach(dep => {
      if(Array.isArray(overrides[dep])) {
        /**
         * we need to delete first, if someone has kv-storage-polyfill in their dependencies, they
         * should have "std:kv-storage" in their importmap, not "kv-storage-polyfill"
         */
        overrides[dep].forEach(res => {
          const resolution = processResolutionName(res);

          delete importmap[resolution];
          delete importmap[`${resolution}/`];
        });
        importmap[dep] = overrides[dep];
      } else {
        delete importmap[dep];
        delete importmap[`${dep}/`];

        importmap[dep] = overrides[dep];
      }
    });
  }
  return importmap;
}
