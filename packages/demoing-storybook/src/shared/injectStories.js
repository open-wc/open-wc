/* eslint-disable no-console */
const storiesPatternsToUrls = require('./storiesPatternsToUrls');

/**
 * @param {object} args
 * @param {string} args.iframeHTML
 * @param {string} args.previewImport
 * @param {string[]} args.storyPatterns
 * @param {string} args.rootDir
 */
async function injectStories({ iframeHTML, previewImport, storyPatterns, rootDir }) {
  const storyUrls = await storiesPatternsToUrls(storyPatterns, rootDir);
  if (storyUrls.length === 0) {
    console.warn(
      `We could not find any stories for the provided pattern(s) "${storyPatterns}". You can configure this in your main.js configuration file.`,
    );
  }

  const newIframeHtml = iframeHTML.replace(
    '</body>',
    `
<script type="module">
  import { configure } from '${previewImport}';
  ${storyUrls.map((url, i) => `import * as story${i} from '${url}'`).join(';\n  ')}

  configure(() => [
    ${storyUrls.map((_, i) => `story${i}`).join(',\n    ')}
  ], {});
  </script>
</body>
`,
  );

  return { html: newIframeHtml, storyUrls };
}

module.exports = { injectStories };
