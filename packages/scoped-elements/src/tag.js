let counter = 0;
const NAME_REGEX = /[^a-zA-Z0-9]/g;

const toDashCase = name => {
  const dashCaseLetters = [];

  for (let i = 0; i < name.length; i += 1) {
    const letter = name[i];
    const letterLowerCase = letter.toLowerCase();

    if (letter !== letterLowerCase && i !== 0) {
      dashCaseLetters.push('-');
    }

    dashCaseLetters.push(letterLowerCase);
  }

  return dashCaseLetters.join('');
};

const isTagRegistered = (registry, name) => !!registry.get(name);

const incrementTagName = (registry, tag) => {
  const newName = `${tag}-${(counter += 1)}`;

  if (isTagRegistered(registry, newName)) {
    return incrementTagName(registry, tag);
  }

  return newName;
};

export const createUniqueTag = (registry, klass) => {
  const name = klass && klass.name && klass.name.replace(NAME_REGEX, '');

  if (name) {
    let tag = toDashCase(name);

    if (tag.indexOf('-') === -1) {
      tag = `c-${tag}`;
    }

    if (isTagRegistered(registry, tag)) {
      return incrementTagName(registry, tag);
    }

    return tag;
  }

  return incrementTagName(registry, 'c');
};
