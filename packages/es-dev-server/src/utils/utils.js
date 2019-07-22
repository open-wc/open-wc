import isStream from 'is-stream';
import getStream from 'get-stream';
import Stream, { Readable } from 'stream';
import path from 'path';

const htmlTags = ['html', 'head', 'body'];

/**
 * Returns the body value as string. If the response is a stream, the
 * stream is drained and the result is returned. Because koa-static stores
 * a path variable on the stream, we need to create a new stream with
 * the same variable to preserve correct behavior.
 *
 * @param {import('koa').Context} ctx
 * @returns {Promise<string>}
 */
export async function getBodyAsString(ctx) {
  if (Buffer.isBuffer(ctx.body)) {
    return ctx.body.toString();
  }

  if (typeof ctx.body === 'string') {
    return ctx.body;
  }

  if (isStream(ctx.body)) {
    const originalStream = ctx.body;
    const bodyString = await getStream(originalStream);

    // create a new stream with the same non-standard path property
    const copyStream = new Readable();
    // @ts-ignore
    copyStream.path = originalStream.path;
    copyStream.push(bodyString, 'utf-8');
    copyStream.push(null);
    ctx.body = copyStream;

    return bodyString;
  }

  return ctx.body;
}

/**
 * Turns a file path into a path suitable for browsers, with a / as seperator.
 * @param {string} filePath
 * @returns {string}
 */
export function toBrowserPath(filePath) {
  return filePath.replace(new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g'), '/');
}

/**
 * Transforms a file system path to a browser URL. For example windows uses `\` on the file system,
 * but it should use `/` in the browser.
 */
export function toFilePath(browserPath) {
  return browserPath.replace(new RegExp('/', 'g'), path.sep);
}

export class SSEStream extends Stream.Transform {
  sendMessage(name, data = '') {
    this.write(`event: ${name}\ndata: ${data}\n\n`);
  }

  _transform(data, enc, cb) {
    this.push(data.toString('utf8'));
    cb();
  }
}

/**
 * Returns the index html response, or null if this wasn't an index.html response
 * @param {import('koa').Context} ctx
 * @param {string} appIndex
 * @returns {Promise<boolean>}
 */
export async function isIndexHTMLResponse(ctx, appIndex) {
  if (ctx.status < 200 || ctx.status >= 300) {
    return false;
  }

  // if we're serving the app index, it's an index html response
  if (ctx.url === appIndex) {
    return true;
  }

  // make the check based on content-type and check
  const contentType = ctx.response.header && ctx.response.header['content-type'];
  if (!contentType || !contentType.includes('text/html')) {
    return false;
  }

  const indexHTMLString = await getBodyAsString(ctx);
  return htmlTags.some(
    tag => indexHTMLString.includes(`<${tag}`) && indexHTMLString.includes(`</${tag}>`),
  );
}
