let counter = 0;

export const SUFFIX = 'se';

const chars = `- | \\. | [0-9] | [a-z]`;
const tagRegExp = new RegExp(`[a-z](${chars})*-(${chars})*`);
const isValid = tag => tagRegExp.exec(tag) !== null;

const isTagRegistered = (registry, name) => !!registry.get(name);

const incrementTagName = (registry, tagName) => {
  const newTagName = `${tagName}-${(counter += 1)}`;

  if (isTagRegistered(registry, newTagName)) {
    return incrementTagName(registry, tagName);
  }

  return newTagName;
};

export const createUniqueTag = (registry, tagName) => {
  if (!isValid(tagName)) {
    throw new Error('tagName is invalid');
  }

  const newTagName = `${tagName}-${SUFFIX}`;

  if (isTagRegistered(registry, newTagName)) {
    return incrementTagName(registry, newTagName);
  }

  return newTagName;
};
