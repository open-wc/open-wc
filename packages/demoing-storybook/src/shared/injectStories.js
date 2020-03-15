/* eslint-disable no-console */
const storiesPatternsToUrls = require('./storiesPatternsToUrls');

/**
 * @param {object} args
 * @param {string} args.iframeHTML
 * @param {string} args.previewImport
 * @param {string} [args.previewConfigImport]
 * @param {string[]} args.storiesPatterns
 * @param {string} args.rootDir
 * @param {boolean} args.absolutePath
 */
async function injectStories({
  iframeHTML,
  previewImport,
  previewConfigImport,
  storiesPatterns,
  rootDir,
  absolutePath,
}) {
  const { files, urls } = await storiesPatternsToUrls({
    storiesPatterns,
    rootDir,
    absolutePath,
  });
  if (urls.length === 0) {
    console.warn(
      `We could not find any stories for the provided pattern(s) "${storiesPatterns}". You can configure this in your main.js configuration file.`,
    );
  }

  const newIframeHtml = iframeHTML.replace(
    '</body>',
    `
<script type="module">
  ${previewConfigImport ? `import '${previewConfigImport}';` : ''}
  import { configure } from '${previewImport}';
  ${urls.map((url, i) => `import * as story${i} from '${url}?storybook-story'`).join(';\n  ')}

  configure(() => [
    ${urls.map((_, i) => `story${i}`).join(',\n    ')}
  ], {});
  </script>
</body>
`,
  );

  return { html: newIframeHtml, storyFiles: files, storyUrls: urls };
}

module.exports = { injectStories };
