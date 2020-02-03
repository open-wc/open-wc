const html = require('../../rollup-plugin-html');

module.exports = {
  input: 'demo/spa/src/my-app.js',
  output: {
    dir: './demo/dist',
  },
  plugins: [
    html({
      template({ bundle }) {
        return `<h1>Hello custom template</h1>
        ${bundle.entrypoints.map(e => `<script type="module" src="${e.importPath}></script>`)}
      `;
      },
    }),
  ],
};
