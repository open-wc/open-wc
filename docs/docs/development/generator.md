# Development >> Generator ||15

Web component project scaffolding.

## Usage

```bash
npm init @open-wc
```

This will kickstart a menu guiding you through all available actions.

```
$ npm init @open-wc
npx: installed 14 in 4.074s
        _.,,,,,,,,,._
     .d''           ``b.       Open Web Components Recommendations
   .p'      Open       `q.
 .d'    Web Components  `b.    Start or upgrade your web component project with
 .d'                     `b.   ease. All our recommendations at your fingertips.
 ::   .................   ::
 `p.                     .q'   See more details at https://open-wc.org/init/
  `p.    open-wc.org    .q'
   `b.     @openWc     .d'
     `q..            ..,'      Note: you can exit any time with Ctrl+C or Esc
        '',,,,,,,,,,''


? What would you like to do today? › - Use arrow-keys. Return to submit.
❯  Scaffold a new project
   Upgrade an existing project
```

Our generators are very modular you can pick and choose as you see fit.

## Scaffold generators

These generators help you kickstart a new app or web component.
They will create a new folder and set up everything you need to get started immediately.

Example usage:

```bash
npm init @open-wc
# Select "Scaffold a new project"
```

### Available scaffold generators:

- `Web Component`<br/>
  This generator scaffolds a starting point for a web component. We recommend using this generator when you want to develop and publish a single web component.
  <br/>

- `Application`<br/>
  This generator scaffolds a new starter application. We recommend using this generator at the start of your web component project.
  <br/>

## Features

The above generators are the perfect playgrounds to prototype.
Add linting, testing, demoing and building whenever the need arises.

Example usage:

```bash
cd existing-web-component
npm init @open-wc
# select "Upgrade an existing project" or add features while scaffolding
```

### Available Upgrade features

- `Linting`<br>
  This generator adds a complete linting setup with ESLint, Prettier, Husky and commitlint.
  <br/>

- `Testing`<br>
  This generator adds a complete testing setup with Karma.
  <br/>

- `Demoing`<br>
  This generator adds a complete demoing setup with Storybook.
  <br/>

- `Building`<br>
  This generator adds a complete building setup with rollup.
  <br/>

## Extending

`create` was made with extensibility in mind. It is possible to extend the core parts of create, and customize it to create your own scaffolder CLI.

For these docs we use the [code-workshop-kit generator](https://github.com/code-workshop-kit/create) as an example which you can run with `npm init code-workshop-kit` to see it in action.

### Required files to customize

There are 3 main places that control how the scaffolder works, you can change the folder structure to whatever you like but in this case we use:

- `./app/*` which is where we put files that control what the CLI menu contains and the way the user chosen options map to mixins. These mixins control which templates will be scaffolded for the user. This is our main entrypoint.

- `./*/*` which is where we put templates that get called by the mixins. E.g. a PythonMixin would link to `./python/index.js` to scaffold the template files that are in `./python/templates/*`.

- `./` where we put files to configure the intro message, which base Generator class is used and which mixin is used where the CLI menu is configured.

#### app/header.js

Customize your own CLI header. For inspiration, google ASCII art!

```js
import chalk from 'chalk';

export default `

${chalk.white('░█████╗░░██╗░░░░░░░██╗██╗░░██╗')}
${chalk.white('██╔══██╗░██║░░██╗░░██║██║░██╔╝')}
${chalk.white('██║░░╚═╝░╚██╗████╗██╔╝█████═╝░')}    ${chalk.white('code-workshop-kit scaffolder')}
${chalk.white('██║░░██╗░░████╔═████║░██╔═██╗░')}      ${chalk.blue('Kickstart your workshop!')}
${chalk.white('╚█████╔╝░░╚██╔╝░╚██╔╝░██║░╚██╗')}
${chalk.white('░╚════╝░░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝')}

`;
```

#### app/index.js

Here we use command-line-args and prompts to create the CLI menu.

```js
/* eslint-disable no-console */
import prompts from 'prompts';
import commandLineArgs from 'command-line-args';
import { executeMixinGenerator } from '@open-wc/create/dist/core.js';

import header from './header.js';
import { gatherMixins } from './gatherMixins.js';
import Generator from '../Generator.js';

/**
 * Allows to control the data via command line
 *
 * example:
 * npm init code-workshop-kit --type python --writeToDisk true
 */
const optionDefinitions = [
  { name: 'destinationPath', type: String },
  { name: 'type', type: String },
  { name: 'name', type: String },
  { name: 'writeToDisk', type: String },
];
const overrides = commandLineArgs(optionDefinitions);
prompts.override(overrides);

export const AppMixin = subclass =>
  // eslint-disable-next-line no-shadow
  class AppMixin extends subclass {
    constructor() {
      super();
      this.wantsWriteToDisk = false;
      this.wantsRecreateInfo = false;
    }

    async execute() {
      console.log(header);
      const questions = [
        {
          type: 'select',
          name: 'type',
          message: 'What kind of workshop would you like to scaffold?',
          choices: [
            { title: 'NodeJS', value: 'jsNode' },
            { title: 'Python', value: 'python', disabled: true },
          ],
        },
        {
          type: 'text',
          name: 'name',
          message: 'What is the name of your workshop?',
          validate: name =>
            !/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
              ? 'Please use digits, hyphens and alphabetic A-Z letters only'
              : true,
        },
      ];

      this.options = await prompts(questions, {
        onCancel: () => {
          process.exit();
        },
      });

      const mixins = gatherMixins(this.options);
      // app is separate to prevent circular imports
      await executeMixinGenerator(mixins, this.options, Generator);
    }
  };

export default AppMixin;
```

#### app/gatherMixins.js

This is where you gather scaffolder mixins based on the options given by the user.

E.g. if the user selected "java", you will push the `JavaMixin` to the array of mixins to run through for scaffolding the needed files.

```js
import { NodeJSMixin } from '../nodejs/index.js';
import { JavaMixin } from '../java/index.js';

export function gatherMixins(options) {
  const mixins = [];

  switch (options.type) {
    case 'jsNode':
      mixins.push(NodeJSMixin);
      break;
    case 'java':
      mixins.push(JavaMixin);
      break;
    // no default
  }

  return mixins;
}
```

#### create.js

In this file you can customize the initialization logic of the generator.
This is the file that you run with NodeJS to start the scaffolder.

Below is an example, where we do two essential things:

- Set our own warning messages for outdated node versions
- Ensure the generator is called with our own `Generator` as base class and our own `AppMixin`, but we reuse executeMixinGenerator from `@open-wc/create`

```js
#!/usr/bin/env node

/* eslint-disable no-console */

import semver from 'semver';
import chalk from 'chalk';
import { executeMixinGenerator } from '@open-wc/create/dist/core.js';
import Generator from './Generator.js';
import { AppMixin } from './app/index.js';

(async () => {
  try {
    if (semver.lte(process.version, '10.12.0')) {
      console.log(
        chalk.bgRed('\nUh oh! Looks like you dont have Node v10.12.0 or higher installed!\n'),
      );
      console.log(`You can do this by going to ${chalk.underline.blue(`https://nodejs.org/`)}

Or if you use nvm:
  $ nvm install node ${chalk.gray(`# "node" is an alias for the latest version`)}
  $ nvm use node
`);
    } else {
      await executeMixinGenerator([AppMixin], {}, Generator);
    }
  } catch (err) {
    console.log(err);
  }
})();
```

#### Generator.js

You should extend the base Generator from `@open-wc/create` and at the very least change the generatorName. Other methods you might want to override are `execute` and `end` to customize some of the logics or for example the end console messages after the scaffold has finished.

```js
/* eslint-disable no-console, import/no-cycle */
import _Generator from '@open-wc/create/dist/Generator.js';

class Generator extends _Generator.default {
  constructor() {
    super();
    this.generatorName = 'my-generator';
  }
}

export default Generator;
```

#### java/\*

This can be any folder name, but we use the example of java template.

Inside this java folder we put everything we need to scaffold for when the user select the Java option in the CLI. These folders usually have an `index.js` containing in this case the JavaMixin:

```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { CommonMixin } from '../common/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* eslint-disable no-console */
export const JavaMixin = subclass =>
  class extends CommonMixin(subclass) {
    async execute() {
      await super.execute();

      this.copyTemplate(
        `${__dirname}/templates/cwk.config.js`,
        this.destinationPath(`cwk.config.js`),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`, this.destinationPath());
    }
  };
```

As you can see, we extend a `CommonMixin` which has files that are common to all CLI options, e.g. for both Java, Python, NodeJS, think of a `LICENSE` file or a `README.md`.

In the `execute` method, you can specify which files are copied as a result of the mixin. Note that template tags are replaced in case you need to inject dynamic data into the templates, e.g. based on what the user selects in the CLI menu like a project name or similar.

- `this.copyTemplate()` Queue a single file copy from the template to the destinationPath.
- `this.copyTemplates()` Same as above but for multiple files, using glob pattern for input instead.
- `this.copyTemplateJsonInto()` Same as `copyTemplate` but for JSON files. The cool thing here is that it will do the equivalent of a deepmerge if the JSON file already exists. Useful if you have different templates adding different things to a `package.json` file, just to name an example.

You can put the template input files anywhere you feel makes sense and map them to any outputPath.

#### app/executeViaOptions.js

This is in case people want to run your scaffolder directly through NodeJS, by calling the method and passing the options imperatively instead of through a CLI.

Here you will have to ensure that you pass your custom Generator class to the executeMixinGenerator. This is very similar to `create.js`, except here the scaffolder is ran via CLI flags/options rather than via the AppMixin (generator through CLI menu).

```js
import { executeMixinGenerator } from '@open-wc/create/dist/core.js';
import { gatherMixins } from './gatherMixins.js';
import Generator from '../Generator.js';

export async function executeViaOptions(options) {
  const mixins = gatherMixins(options);

  await executeMixinGenerator(mixins, options, Generator);
}
```

##### Configure EJS options

The three methods for copying from templates as listed above, all accept a parameter for overriding [EJS](https://ejs.co/) options, for example if you need to change the delimiter of the template tags that you use in your templates.

```js
export default { title: '<?= name ?>' }; // instead of usual <%= name %>
```

```js
this.copyTemplate(`${__dirname}/templates/config.js`, this.destinationPath(`config.js`), {
  delimiter: '?',
});
```
