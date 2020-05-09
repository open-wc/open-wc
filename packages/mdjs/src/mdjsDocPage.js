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

      code[class*="language-"],
      pre[class*="language-"] {
        color: #393A34;
        font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
        direction: ltr;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        tab-size: 4;
        hyphens: none;
        margin-bottom: 16px;
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: #f6f8fa;
        border-radius: 3px;
      }

      .token.function,
      .token.class-name {
        color: #6f42c1;
      }

      .token.tag,
      .token.selector,
      .language-autohotkey .token.keyword {
        color: #22863a;
      }

      .token.entity,
      .token.url,
      .token.symbol,
      .token.number,
      .token.boolean,
      .token.variable,
      .token.constant,
      .token.property,
      .token.inserted,
      .token.punctuation,
      .token.operator {
        color: #005cc5;
      }

      .token.regex {
        color: #032f62;
      }

      .token.atrule,
      .token.keyword,
      .token.attr-name,
      .language-autohotkey .token.selector {
        color: #d73a49;
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
