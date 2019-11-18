const proxy = require('koa-proxies');

module.exports = {
  port: 9000,
  customMiddlewares: [
    proxy('*', {
      target: 'https://open-wc.org',
      changeOrigin: true,
      logs: true,
    }),
  ],
};
