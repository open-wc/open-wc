import qoa from 'qoa';
import commandLineArgs from 'command-line-args';

const optionDefinitions = [
  { name: 'tag-name', type: String, defaultValue: '' },
  { name: 'no-npm', type: Boolean, defaultValue: false },
  { name: 'no-scaffold', type: Boolean, defaultValue: false }
]

export const cliOptions = commandLineArgs(optionDefinitions, { partial: true });

function getClassName(tagName) {
  return tagName
    .split('-')
    .reduce((previous, part) => previous + part.charAt(0).toUpperCase() + part.slice(1), '');
}

export async function askTagInfo() {
  // before super to also affect the Mixin it applies
  let tagName = '';
  let className = '';

  if(!cliOptions['tag-name']){
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
    className = cliOptions['tag-name'].replace(/-([a-z])/g, g => g[1].toUpperCase()).replace(/^\w/, c => c.toUpperCase());
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
