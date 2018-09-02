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

    // Write & rename element src
    this.fs.copyTpl(
      this.templatePath('ExampleElement.js'),
      this.destinationPath(`${className}.js`),
      this
    );

    // Write & rename element definition
    this.fs.copyTpl(
      this.templatePath('example-element.js'),
      this.destinationPath(`${tagName}.js`),
      this
    );

    // Write everything else
    this.fs.copyTpl(
      glob.sync(this.templatePath('!(ExampleElement.js|example-element.js)'), { dot: true }),
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
