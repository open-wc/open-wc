/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { Middleware } from 'koa';
import { getBodyAsString, RequestCancelledError, IsBinaryFileError } from '../utils/utils';

interface ResponseTransformerArgs {
  url: string;
  headers: Record<string, string>;
  status: number;
  contentType: string;
  body: string;
}

interface ResponseTransformerReturnValue {
  body?: string;
  contentType?: string;
}

export type ResponseTransformer = (
  args: ResponseTransformerArgs,
) => ResponseTransformerReturnValue | null | Promise<ResponseTransformerReturnValue | null>;

interface ResponseTransformMiddlewareConfig {
  responseTransformers: ResponseTransformer[];
}

export function createResponseTransformMiddleware(
  config: ResponseTransformMiddlewareConfig,
): Middleware {
  return async function responseTransformMiddlewareConfig(ctx, next) {
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
        headers: ctx.headers,
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
  };
}
