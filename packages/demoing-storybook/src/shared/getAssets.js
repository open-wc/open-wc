const fs = require('fs');
const path = require('path');
const toBrowserPath = require('./toBrowserPath');

module.exports = function getAssets({
  storybookConfigDir,
  rootDir,
  previewImport,
  managerImport,
  storyUrls,
}) {
  const managerIndexPath = path.join(__dirname, 'index.html');
  const iframePath = path.join(__dirname, 'iframe.html');
  const managerHeadPath = path.join(process.cwd(), storybookConfigDir, 'manager-head.html');
  const previewBodyPath = path.join(process.cwd(), storybookConfigDir, 'preview-body.html');
  const previewHeadPath = path.join(process.cwd(), storybookConfigDir, 'preview-head.html');
  const previewJsPath = path.join(process.cwd(), storybookConfigDir, 'preview.js');
  const previewJsImport = `./${toBrowserPath(path.relative(rootDir, previewJsPath))}`;

  let indexHTML = fs.readFileSync(managerIndexPath, 'utf-8');
  if (fs.existsSync(managerHeadPath)) {
    const managerHead = fs.readFileSync(managerHeadPath, 'utf-8');
    indexHTML = indexHTML.replace('</head>', `${managerHead}</head>`);
  }

  indexHTML = indexHTML.replace(
    '</body>',
    `<script type="module" src="${managerImport}"></script>`,
  );

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
      ${
        fs.existsSync(previewJsPath)
          ? `<script type="module" src="${previewJsImport}"></script>`
          : ''
      }
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
    indexHTML,
    iframeHTML,
  };
};
