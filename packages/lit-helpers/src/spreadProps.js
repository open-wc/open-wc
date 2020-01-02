/* eslint-disable no-param-reassign, no-restricted-syntax, guard-for-in */
import { directive } from 'lit-html';

/** @typedef {import('lit-html').PropertyPart} PropertyPart */

const previousProps = new WeakMap();

export const spreadProps = directive((/** @type {{ [key: string]: unknown }} */ props) => (
  /** @type {PropertyPart} */ part,
) => {
  const prev = previousProps.get(part);
  if (prev === props) {
    return;
  }
  previousProps.set(part, props);

  // set new properties if they changed
  if (props) {
    // for in is faster than Object.entries().forEach
    for (const key in props) {
      const value = props[key];
      if (!prev || prev[key] !== value) {
        part.committer.element[key] = value;
      }
    }
  }

  // remove previously set properties if they were removed
  if (prev) {
    // for in is faster than Object.entries().forEach
    for (const key in prev) {
      if (!props || !(key in props)) {
        part.committer.element[key] = undefined;
      }
    }
  }
});
