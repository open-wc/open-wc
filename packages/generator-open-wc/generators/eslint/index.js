var Generator = require('yeoman-generator');
const glob = require('glob');

function getClassName(tagName) {
  return tagName.split('-').reduce((previous, part) => {
    return previous + part.charAt(0).toUpperCase() + part.slice(1);
  }, '');
}

module.exports = class GeneratorOpenWc extends Generator {
  prompting() {
    const done = this.async();

    return this.prompt(PROMPTS).then(answers => {
      this.props = answers;
      done();
    });
  }

  default() {
    const { tagName, type } = this.props;

    // Build component class
    this.props.className = getClassName(tagName);
  }

  writing() {
    const { tagName, className } = this.props;

    // extend package.json
    this.fs.extendJSON(
      this.destinationPath('package.json'),
      this.fs.readJSON(this.templatePath('package.json'))
    );

    // Write everything else
    this.fs.copyTpl(
      glob.sync(this.templatePath('!(package.json)'), { dot: true }),
      this.destinationPath(),
      this
    );
  }
};

const PROMPTS = [
  {
    name: 'tagName',
    type: 'input',
    required: true,
    message: 'Give it a tag name (min two words separated by dashes)',
    validate: str => /^([a-z])(?!.*[<>])(?=.*-).+$/.test(str)
  },
];
