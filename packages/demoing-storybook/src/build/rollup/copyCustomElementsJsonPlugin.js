const fs = require('fs-extra');
const listFiles = require('../../shared/listFiles');

function copyCustomElementsJsonPlugin(outputRootDir) {
  return {
    async generateBundle() {
      const files = await listFiles(
        `{,!(node_modules|web_modules|bower_components|${outputRootDir})/**/}custom-elements.json`,
        process.cwd(),
      );

      for (const file of files) {
        const destination = file.replace(process.cwd(), '');

        this.emitFile({
          type: 'asset',
          fileName: destination.substring(1, destination.length),
          source: fs.readFileSync(file, 'utf-8'),
        });
      }
    },
  };
}

module.exports = { copyCustomElementsJsonPlugin };
