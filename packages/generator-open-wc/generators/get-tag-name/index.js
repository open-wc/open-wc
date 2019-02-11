const Generator = require('yeoman-generator');
const path = require('path');

const PROMPTS = [
  {
    name: 'tagName',
    type: 'input',
    required: true,
    message: 'Give it a tag name (min two words separated by dashes)',
    validate: str => /^([a-z])(?!.*[<>])(?=.*-).+$/.test(str),
    default: path.basename(process.cwd()),
  },
];

function getClassName(tagName) {
  return tagName
    .split('-')
    .reduce((previous, part) => previous + part.charAt(0).toUpperCase() + part.slice(1), '');
}

module.exports = class GeneratorGetTagName extends Generator {
  async prompting() {
    this.answers = await this.prompt(PROMPTS);
    this.answers.className = getClassName(this.answers.tagName);
    this.__setOption('tagName', this.answers.tagName);
    this.__setOption('className', getClassName(this.answers.tagName));
  }

  __setOption(option, value) {
    this.options.__store.set(option, value);
    this.config.set(option, value);
  }
};
