module.exports = {
  nodeResolve: true,
  open: './_site-dev',
  responseTransformers: [
    function rewriteBasePath({ contentType, body }) {
      if (contentType.includes('text/html')) {
        return {
          body: body
            .replace(/href="\//g, 'href="/_site-dev/')
            .replace(/src="\//g, 'src="/_site-dev/'),
        };
      }
      return null;
    },
  ],
};
