const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function createContentHash(content) {
  return crypto
    .createHash('md4')
    .update(content)
    .digest('hex');
}

module.exports = function getAssets({ storybookConfigDir, managerPath, previewImport, storyUrls }) {
  const managerIndexPath = path.join(__dirname, 'index.html');
  const iframePath = path.join(__dirname, 'iframe.html');
  const managerHeadPath = path.join(process.cwd(), storybookConfigDir, 'manager-head.html');
  const previewBodyPath = path.join(process.cwd(), storybookConfigDir, 'preview-body.html');
  const previewHeadPath = path.join(process.cwd(), storybookConfigDir, 'preview-head.html');

  let managerCode = fs.readFileSync(require.resolve(managerPath), 'utf-8');
  const managerSourceMap = fs.readFileSync(require.resolve(`${managerPath}.map`), 'utf-8');

  const managerHash = createContentHash(managerCode);
  const managerScriptUrl = `/storybook-manager-${managerHash}.js`;
  const managerSourceMapUrl = `/storybook-manager-${managerHash}.js.map`;
  const managerScriptSrc = `.${managerScriptUrl}`;

  managerCode = managerCode.replace(
    '//# sourceMappingURL=manager.js.map',
    `//# sourceMappingURL=${managerSourceMapUrl}`,
  );

  let indexHTML = fs.readFileSync(managerIndexPath, 'utf-8');
  if (fs.existsSync(managerHeadPath)) {
    const managerHead = fs.readFileSync(managerHeadPath, 'utf-8');
    indexHTML = indexHTML.replace('</head>', `${managerHead}</head>`);
  }

  indexHTML = indexHTML.replace('</body>', `<script src="${managerScriptSrc}"></script>`);

  let iframeHTML = fs.readFileSync(iframePath, 'utf-8');
  if (fs.existsSync(previewHeadPath)) {
    const previewHead = fs.readFileSync(previewHeadPath, 'utf-8');
    iframeHTML = iframeHTML.replace('</head>', `${previewHead}</head>`);
  }

  if (fs.existsSync(previewBodyPath)) {
    const previewBody = fs.readFileSync(previewBodyPath, 'utf-8');
    iframeHTML = iframeHTML.replace('</body>', `${previewBody}</body>`);
  }

  iframeHTML = iframeHTML.replace(
    '</body>',
    `
      </body>
      <script type="module" src="./${storybookConfigDir}/preview.js"></script>
      <script type="module">
        import { configure } from '${previewImport}';

        Promise.all([
          ${storyUrls.map(url => `import('${url}')`).join(',\n')}
        ]).then(stories => {
          configure(() => stories, {});
        });
      </script>
    `,
  );

  return {
    managerCode,
    managerScriptSrc,
    managerScriptUrl,
    managerSourceMap,
    managerSourceMapUrl,
    indexHTML,
    iframeHTML,
  };
};
