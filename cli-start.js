/* eslint-disable */

const { createConfig, startServer } = require('es-dev-server');
const Eleventy = require('@11ty/eleventy');

const elev = new Eleventy('./docs', './__site');
elev.setConfigPathOverride('./docs/.eleventy.js');
elev.setDryRun(true); // do not write to file system

async function run() {
  await elev.init();

  const config = {
    nodeResolve: true,
    watch: true,
    open: './docs/README.md',
    middlewares: [
      async (ctx, next) => {
        if (ctx.path.endsWith('index.html')) {
          ctx.path = ctx.path.replace('index.html', 'README.md');
        } else if (ctx.path.endsWith('.html')) {
          ctx.path = ctx.path.replace('.html', '.md');
        } else if (ctx.path.endsWith('/')) {
          ctx.path += 'README.md';
        }
        return next();
      },
    ],
    plugins: [
      {
        async transform(context) {
          if (context.path.endsWith('md')) {
            const serverPath = context.path;
            let { body } = 'File not found';
            elev.config.filters['hook-for-rocket'] = (content, outputPath, inputPath) => {
              if (inputPath === `.${serverPath}`) {
                body = content;
              }
              return content;
            };
            await elev.write();
            return {
              body: body.replace(/href="\//g, 'href="/docs/').replace(/src="\//g, 'src="/docs/'),
            };
          }
          return undefined;
        },
        resolveMimeType(context) {
          if (context.path.endsWith('md')) {
            return 'text/html';
          }
          return undefined;
        },
      },
    ],
  };

  startServer(createConfig(config));

  ['exit', 'SIGINT'].forEach(event => {
    // @ts-ignore
    process.on(event, () => {
      process.exit(0);
    });
  });
}

run();
