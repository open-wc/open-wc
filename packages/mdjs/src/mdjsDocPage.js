const { mdjsProcess } = require('./mdjsProcess.js');

/**
 *
 * @param {string} body
 * @returns {Promise<string>}
 */
async function mdjsDocPage(body) {
  const data = await mdjsProcess(body);
  return `
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/node_modules/github-markdown-css/github-markdown.css">
    <style>
      .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
        border: 1px solid #e1e4e8;
        border-bottom-right-radius: 2px;
        border-bottom-left-radius: 2px;
      }

      @media (max-width: 767px) {
        .markdown-body {
          padding: 15px;
        }
      }
    </style>
    <script type="module">
      ${data.jsCode}
    </script>
    <div class="markdown-body">
      ${data.html}
    </div>
  `;
}

module.exports = {
  mdjsDocPage,
};
