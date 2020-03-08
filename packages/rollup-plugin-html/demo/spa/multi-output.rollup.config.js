const html = require('../../rollup-plugin-html');

const htmlPlugin = html({
  name: 'index.html',
  inject: false,
  template({ bundles }) {
    return `
      <html>
        <body>
        <script nomodule src="./systemjs.js"></script>
        ${bundles[0].entrypoints.map(
          e => `<script nomodule>System.import("${e.importPath}")</script>`,
        )}

        ${bundles[1].entrypoints.map(
          e => `
          <script type="module" src="${e.importPath}"></script>
        `,
        )}
        </body>
      </html>
    `;
  },
});

module.exports = {
  input: './demo/spa/src/my-app.js',
  output: [
    {
      format: 'system',
      dir: './demo/dist/legacy',
      plugins: [htmlPlugin.addOutput()],
    },
    {
      format: 'es',
      dir: './demo/dist',
      plugins: [htmlPlugin.addOutput()],
    },
  ],
  plugins: [htmlPlugin],
};
