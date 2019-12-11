/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { getBodyAsString, RequestCancelledError, IsBinaryFileError } from '../utils/utils.js';

/**
 * @typedef {object} ResponseTransformerArgs
 * @property {string} url
 * @property {number} status
 * @property {string} contentType
 * @property {string} body
 */

/**
 * @typedef {object} ResponseTransformerReturnValue
 * @property {string} [body]
 * @property {string} [contentType]
 */

/**
 * @typedef {(ResponseTransformerArgs) => ResponseTransformerReturnValue | null | Promise<ResponseTransformerReturnValue | null>} ResponseTransformer
 */

/**
 * @typedef {object} ResponseTransformMiddlewareConfig
 * @property {ResponseTransformer[]} responseTransformers
 */

/**
 *
 * @param {ResponseTransformMiddlewareConfig} config
 */
export function createResponseTransformMiddleware(config) {
  /** @type {import('koa').Middleware} */
  async function responseTransformMiddlewareConfig(ctx, next) {
    await next();

    let body;
    try {
      body = await getBodyAsString(ctx);
    } catch (error) {
      if (error instanceof RequestCancelledError) {
        return;
      }

      if (error instanceof IsBinaryFileError) {
        return;
      }
      throw error;
    }

    let newBody = body;
    let newContentType = ctx.response.get('content-type');
    let changedBody = false;
    let changedContentType = false;

    // execute transformers in order, not parallel
    for (const transformer of config.responseTransformers) {
      const result = await transformer({
        url: ctx.url,
        status: ctx.status,
        contentType: newContentType,
        body: newBody,
      });

      if (result) {
        if (typeof result.body === 'string') {
          newBody = result.body;
          changedBody = true;
        }

        if (result.contentType) {
          newContentType = result.contentType;
          changedContentType = true;
        }
      }

      if (result && result.body) {
        newBody = result.body;
      }
    }

    // if the body was transformed, we always serve it as 200. this allows serving a
    // virtual file which doesn't exist (404 on the file system)
    if (changedBody) {
      ctx.status = 200;
      ctx.body = newBody;
    }

    if (changedContentType) {
      ctx.response.set('content-type', newContentType);
    }
  }

  return responseTransformMiddlewareConfig;
}
