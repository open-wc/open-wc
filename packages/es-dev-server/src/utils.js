import isStream from 'is-stream';
import getStream from 'get-stream';
import Stream from 'stream';
import path from 'path';

/**
 * @param {any} body
 * @returns {Promise<string>}
 */
export async function getBodyAsString(body) {
  if (Buffer.isBuffer(body)) {
    return body.toString();
  }

  if (isStream(body)) {
    return getStream(body);
  }

  if (typeof body !== 'string') {
    return '';
  }
  return body;
}

/**
 * Turns a file path into a path suitable for browsers, with a / as seperator.
 * @param {string} filePath
 * @returns {string}
 */
export function toBrowserPath(filePath) {
  return filePath.replace(new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g'), '/');
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
