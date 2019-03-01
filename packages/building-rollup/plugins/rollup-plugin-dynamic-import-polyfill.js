import path from 'path';
import MagicString from 'magic-string';

let inputPaths;

export default () => ({
  name: 'dynamic-import-polyfill',

  options(config) {
    inputPaths = config.input;
  },

  transform(code, id) {
    if (inputPaths.map(p => path.resolve(p)).includes(id)) {
      const magicString = new MagicString(code);
      magicString.prepend(`import '${path.resolve('./src/import-module.js')}';`);

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    }

    return null;
  },
});
