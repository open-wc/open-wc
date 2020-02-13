import { fromCache, toCache } from './cache.js';
import { registerElement } from './scoped-elements.js';

const re = /<\/?([a-zA-Z0-9-]+)/g;

const matchAll = str => {
  const matches = [];
  let result;
  // eslint-disable-next-line no-cond-assign
  while ((result = re.exec(str)) !== null) {
    matches.push(result);
  }

  return matches;
};

const transformTemplate = (strings, tags) =>
  toCache(
    strings,
    strings.map(str => {
      let acc = str;
      const matches = matchAll(str);

      for (let i = matches.length - 1; i >= 0; i -= 1) {
        const item = matches[i];
        const klass = tags[item[1]];

        if (klass) {
          const tag = registerElement(item[1], klass);
          const start = item.index + item[0].length - item[1].length;
          const end = start + item[1].length;

          acc = acc.slice(0, start) + tag + acc.slice(end);
        }
      }

      return acc;
    }),
  );

export const transform = (strings, tags) => fromCache(strings) || transformTemplate(strings, tags);
