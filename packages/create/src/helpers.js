import qoa from 'qoa';

function getClassName(tagName) {
  return tagName
    .split('-')
    .reduce((previous, part) => previous + part.charAt(0).toUpperCase() + part.slice(1), '');
}

export async function askTagInfo() {
  // before super to also affect the Mixin it applies
  let tagName = '';
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
  const className = getClassName(tagName);

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
