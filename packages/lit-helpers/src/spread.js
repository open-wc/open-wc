/* eslint-disable no-param-reassign, no-restricted-syntax, guard-for-in, no-continue */
import { directive, noChange } from 'lit-html';

/** @typedef {import('lit-html').AttributePart} AttributePart */

/** @type {WeakMap<AttributePart, { [key: string]: unknown }>} */
const prevCache = new WeakMap();

export const spread = directive((/** @type {{ [key: string]: unknown }} */ spreadData) => (
  /** @type {AttributePart} */ part,
) => {
  const prevData = prevCache.get(part);
  if (prevData === spreadData) {
    return;
  }
  prevCache.set(part, spreadData);

  // set new spread data
  if (spreadData) {
    // for in is faster than Object.entries().forEach
    for (const key in spreadData) {
      const value = spreadData[key];
      if (value === noChange) {
        continue;
      }

      const prefix = key[0];
      const { element } = part.committer;

      // event listener
      if (prefix === '@') {
        const prevHandler = prevData && prevData[key];
        if (!prevHandler || prevHandler !== value) {
          const name = key.slice(1);
          if (prevHandler) {
            // @ts-ignore
            element.removeEventListener(name, prevHandler);
          }
          // @ts-ignore
          element.addEventListener(name, value);
        }
        continue;
      }

      // property
      if (prefix === '.') {
        if (!prevData || prevData[key] !== value) {
          element[key.slice(1)] = value;
        }
        continue;
      }

      // boolean attribute
      if (prefix === '?') {
        if (!prevData || prevData[key] !== value) {
          const name = key.slice(1);
          if (value) {
            element.setAttribute(name, '');
          } else {
            element.removeAttribute(name);
          }
        }
        continue;
      }

      // attribute
      if (!prevData || prevData[key] !== value) {
        if (value != null) {
          element.setAttribute(key, String(value));
        } else {
          element.removeAttribute(key);
        }
      }
    }
  }

  // remove previously set spread data if they were removed
  if (prevData) {
    // for in is faster than Object.entries().forEach
    for (const key in prevData) {
      if (!spreadData || !(key in spreadData)) {
        const prefix = key[0];
        const { element } = part.committer;

        // event listener
        if (prefix === '@') {
          // @ts-ignore
          element.removeEventListener(key.slice(1), prevData[key]);
          continue;
        }

        // property
        if (prefix === '.') {
          element[key.slice(1)] = undefined;
          continue;
        }

        // boolean attribute
        if (prefix === '?') {
          element.removeAttribute(key.slice(1));
          continue;
        }

        // attribute
        element.removeAttribute(key);
      }
    }
  }
});
