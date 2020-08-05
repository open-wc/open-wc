const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, 'virtual-files','index.html');

function createServeHtmlPlugin() {
  return {
    serverStart({ fileWatcher }) {
      fileWatcher.add(indexPath)
    },
    
    serve(context) {
      if (['/', '/index.html'].includes(context.path)) {
        return { body: fs.readFileSync(indexPath, 'utf-8'), type: 'html' }
      }
    }
  }
}

module.exports = {
  rootDir: __dirname,
  plugins: [
    createServeHtmlPlugin()
  ]
};
