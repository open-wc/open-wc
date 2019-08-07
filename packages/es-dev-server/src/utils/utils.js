import isStream from 'is-stream';
import getStream from 'get-stream';
import Stream from 'stream';
import path from 'path';

/**
 * koa-static stores the original served file path on ctx.body.path,
 * we need this path for file transformation but we overwrite body
 * with a string, so we keep a reference with a weakmap
 */
/** @type {WeakMap<import('koa').Request, string>} */
const filePathsForRequests = new WeakMap();

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
    // cache request path, see above
    // @ts-ignore
    if (ctx.body.path) {
      // @ts-ignore
      filePathsForRequests.set(ctx.request, ctx.body.path);
    }

    // a stream can only be read once, so after reading it assign
    // the string response to the body so that it can be accessed
    // again later
    const body = await getStream(ctx.body);
    ctx.body = body;
    return body;
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

/**
 * @param {import('koa').Context} ctx
 * @param {string} rootDir
 * @returns {string}
 */
export function getRequestFilePath(ctx, rootDir) {
  // inline module requests have the source in a query string
  if (ctx.url.includes('/inline-module-') && ctx.url.includes('?source=')) {
    const url = ctx.url.split('?')[0];
    const indexPath = toFilePath(url);
    return path.join(rootDir, indexPath);
  }

  // otherwise koa-static adds the original file path on the body
  if (ctx.body && ctx.body.path) {
    return ctx.body.path;
  }

  return filePathsForRequests.get(ctx.request);
}
