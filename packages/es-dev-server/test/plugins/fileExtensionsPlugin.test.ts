import path from 'path';
import { expect } from 'chai';
import fetch from 'node-fetch';
import { startServer } from '../../src/start-server';
import { createConfig } from '../../src/config';
import { Plugin } from '../../src/Plugin';

const host = 'http://localhost:8080/';

describe('fileExtensonsPlugin', () => {
  it('serves configured file extensions as JS', async () => {
    const plugins: Plugin[] = [
      {
        serve(context) {
          console.log('serve', context.path);
          if (context.path === '/foo.bar') {
            return { body: 'console.log("foo.bar");' };
          }
        },
      },
    ];

    let server;
    try {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          compatibility: 'none',
          fileExtensions: ['.bar'],
          plugins,
        }),
      ));

      const response = await fetch(`${host}foo.bar`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('console.log("foo.bar");');
      expect(response.headers.get('content-type')).to.include('application/javascript');
    } finally {
      server.close();
    }
  });

  it('the content type is available in plugins', async () => {
    const plugins: Plugin[] = [
      {
        serve(context) {
          if (context.path === '/foo.bar') {
            return { body: 'console.log("foo.bar");' };
          }
        },
      },
      {
        transform(context) {
          if (context.response.is('js')) {
            return { body: 'TRANSFORMED' };
          }
        },
      },
    ];

    let server;
    try {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          compatibility: 'none',
          fileExtensions: ['.bar'],
          plugins,
        }),
      ));

      const response = await fetch(`${host}foo.bar`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('TRANSFORMED');
      expect(response.headers.get('content-type')).to.include('application/javascript');
    } finally {
      server.close();
    }
  });
});
