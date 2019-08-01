const {
  createProgram,
  ScriptTarget,
  ModuleKind,
  createSourceFile,
  ScriptKind,
  sys,
  getDefaultLibFileName,
} = require('typescript');
const { readFileSync, existsSync, writeFileSync, readdirSync } = require('fs');

// Generate declarations for all files in DIR
const DIR = './packages';

// Grab files in DIR
// const fileNames = readdirSync(DIR).map(f => `${DIR}/${f}`);

// console.log(fileNames);

const fileNames = [
  // './packages/building-rollup',
  // './packages/building-utils',
  // './packages/building-webpack',
  // './packages/chai-a11y-axe',
  // './packages/chai-dom-equals',
  // './packages/create',
  // './packages/demoing-storybook',
  // './packages/es-dev-server',
  // './packages/eslint-config',
  // './packages/import-maps-generate',
  // './packages/import-maps-resolve',
  // './packages/karma-esm',
  // './packages/owc-dev-server',
  // './packages/polyfills-loader',
  // './packages/prettier-config',
  // './packages/rollup-plugin-index-html',
  // './packages/semantic-dom-diff',
  // './packages/testing',
  './packages/testing-helpers/index.js',
  './packages/testing-helpers/index-no-side-effects.js',
  // './packages/testing-karma',
  // './packages/testing-karma-bs',
  // './packages/testing-wallaby',
  // './packages/webpack-import-meta-loader',
  // './packages/webpack-index-html-plugin'
];

// Create a program that converts .js to d.ts
const program = createProgram({
  rootNames: fileNames,
  options: {
    module: ModuleKind.ESNext,
    target: ScriptTarget.ESNext,
    allowJs: true,
    sourceMap: false,
    declaration: true,
    noEmitOnError: false,
  },
  host: {
    writeFile: (fileName, data) => {
      // Logging
      const title = `###### ${fileName} ######`;
      console.log(`${title}\n`);
      console.log(data);
      console.log('#'.repeat(title.length));

      return writeFileSync(fileName, data);
    },
    readFile(fileName) {
      return this.fileExists(fileName) ? readFileSync(fileName).toString() : undefined;
    },
    fileExists: fileName => existsSync(fileName),
    getSourceFile(fileName, languageVersion) {
      const sourceText = this.readFile(fileName);
      if (sourceText == null) return undefined;
      return createSourceFile(fileName, sourceText, languageVersion, true, ScriptKind.TS);
    },

    getCurrentDirectory() {
      return '.';
    },

    getDirectories(directoryName) {
      return sys.getDirectories(directoryName);
    },

    getDefaultLibFileName(options) {
      return getDefaultLibFileName(options);
    },

    getCanonicalFileName(fileName) {
      return this.useCaseSensitiveFileNames() ? fileName : fileName.toLowerCase();
    },

    getNewLine() {
      return sys.newLine;
    },
    useCaseSensitiveFileNames() {
      return sys.useCaseSensitiveFileNames;
    },
  },
});

// Emit declaration files
console.log('Writing declaration files...\n');
program.emit(undefined, undefined, undefined, true);
