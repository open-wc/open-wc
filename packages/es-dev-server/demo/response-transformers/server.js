module.exports = {
  appIndex: 'demo/response-transformers/index.html',
  nodeResolve: true,
  open: true,
  watch: true,
  responseTransformers: [
    function serveIndex({ url }) {
      if (url === '/demo/response-transformers/index.html') {
        return {
          body: `
            <html>
              <head>
                <base href="to-be-replaced">
              </head>
              <body>
                <img width="100" src="../logo.png">
                <h1>Demo app</h1>
              </body>
              <script type="module" src="./module-a.js"></script>
            </html>
          `,
          contentType: 'text/html',
        };
      }
      return null;
    },

    function rewriteBasePath({ url, body }) {
      if (url === '/demo/response-transformers/index.html') {
        return {
          body: body.replace(/<base href=".*">/, '<base href="/demo/response-transformers/">'),
        };
      }
      return null;
    },

    function transformCSS({ url, body }) {
      if (url.endsWith('.css')) {
        const transformedBody = `
          const stylesheet = new CSSStyleSheet();
          stylesheet.replaceSync(${JSON.stringify(body)});
          export default stylesheet;
        `;
        return { body: transformedBody, contentType: 'application/javascript' };
      }
      return null;
    },
  ],
};
