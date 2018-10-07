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
  return tagName.split('-').reduce((previous, part) => previous + part.charAt(0).toUpperCase() + part.slice(1), '');
}

module.exports = class GeneratorGetTagName extends Generator {
  prompting() {
    const done = this.async();

    return this.prompt(PROMPTS).then((answers) => {
      this.props = answers;
      this.props.className = getClassName(this.props.tagName);
      done();
    });
  }

  configuring() {
    this.__setOption('tagName', this.props.tagName);
    this.__setOption('className', getClassName(this.props.tagName));
  }

  __setOption(option, value) {
    this.options.__store.set(option, value);
    this.config.set(option, value);
  }
};
