import qoa from 'qoa';
import { cliOptions } from './Generator.js';

function getClassName(tagName) {
  return tagName
    .split('-')
    .reduce((previous, part) => previous + part.charAt(0).toUpperCase() + part.slice(1), '');
}

export function parseCliOptions(optns) {
  Object.keys(optns).forEach(key => {
    if (optns[key] === 'false') optns[key] = false; // eslint-disable-line no-param-reassign
    if (optns[key] === 'true') optns[key] = true; // eslint-disable-line no-param-reassign
  });
  return optns;
}

export async function askTagInfo() {
  // before super to also affect the Mixin it applies
  let tagName = '';
  let className = '';

  if (!cliOptions['tag-name']) {
    tagName = '';
    do {
      // eslint-disable-next-line no-await-in-loop
      const result = await qoa.prompt([
        {
          type: 'input',
          query: 'Give it a tag name (min two words separated by dashes)',
          handle: 'tagName',
        },
      ]);
      // eslint-disable-next-line prefer-destructuring
      tagName = result.tagName;
    } while (/^([a-z])(?!.*[<>])(?=.*-).+$/.test(tagName) === false);
    className = getClassName(tagName);
  } else {
    tagName = cliOptions['tag-name'];
    className = getClassName(cliOptions['tag-name']);
  }

  return { className, tagName };
}

export async function askYesNo(query) {
  const { yesNo } = await qoa.prompt([
    {
      type: 'interactive',
      query,
      handle: 'yesNo',
      symbol: '>',
      menu: ['Yes', 'No'],
    },
  ]);
  return yesNo === 'Yes';
}
