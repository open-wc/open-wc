import _rimraf from 'rimraf';
import chai from 'chai';
import chaiFs from 'chai-fs';
import { exec as _exec } from 'child_process';
import { promisify } from 'util';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { CLIEngine } from 'eslint';
import { generateCommand } from './generate-command.js';

const exec = promisify(_exec);

const rimraf = promisify(_rimraf);

const { expect } = chai;

chai.use(chaiFs);

const getFileMessages = ({ messages, filePath }) => `${filePath}:\n${messages.join('\n')}`;

const ACTUAL_PATH = join(process.cwd(), './scaffold-app');

/**
 * Deletes the test files
 */
async function deleteGenerated() {
  await rimraf(ACTUAL_PATH);
}

/**
 * Removes text from the cli output which is specific to the local environment, i.e. the full path to the output dir.
 * @param  {string} output raw output
 * @return {string}        cleaned output
 */
function stripUserDir(output) {
  return output.replace(/\b(.*)\/scaffold-app/, '/scaffold-app');
}

/**
 * Asserts that the contents of a file at a path equal the contents of a file at another path
 * @param  {string} expectedPath path to expected output
 * @param  {string} actualPath   path to actual output
 */
function assertFile(expectedPath, actualPath) {
  expect(actualPath).to.be.a.file().and.equal(expectedPath);
}

/**
 * Recursively checks a directory's contents, asserting each file's contents
 * matches it's counterpart in a snapshot directory
 * @param  {string} expectedPath snapshot directory path
 * @param  {string} actualPath   output directory path
 */
function checkSnapshotContents(expectedPath, actualPath) {
  readdirSync(actualPath).forEach(filename => {
    const actualFilePath = join(actualPath, filename);
    const expectedFilePath = join(expectedPath, filename);
    return lstatSync(actualFilePath).isDirectory()
      ? checkSnapshotContents(expectedFilePath, actualFilePath)
      : assertFile(expectedFilePath, actualFilePath);
  });
}

let stdout;
let stderr;
let EXPECTED_OUTPUT;

const generate = ({ command, expectedPath }) =>
  async function generateTestProject() {
    ({ stdout, stderr } = await exec(command));
    const EXPECTED_PATH = join(expectedPath, '../fully-loaded-app.output.txt');
    EXPECTED_OUTPUT = readFileSync(EXPECTED_PATH, 'utf-8');
  };

describe('create', function create() {
  this.timeout(10000);

  // For some reason, this doesn't do anything
  const destinationPath = join(__dirname, './output');

  const expectedPath = join(__dirname, './snapshots/fully-loaded-app');

  const command = generateCommand({ destinationPath });

  before(generate({ command, expectedPath }));

  after(deleteGenerated);

  it('scaffolds a fully loaded app project', async () => {
    // Check that all files exist, without checking their contents
    expect(ACTUAL_PATH).to.be.a.directory().and.deep.equal(expectedPath);
  });

  it('generates expected file contents', () => {
    // Check recursively all file contents
    checkSnapshotContents(expectedPath, ACTUAL_PATH);
  });

  it.skip('outputs expected message', () => {
    expect(stripUserDir(stdout)).to.equal(stripUserDir(EXPECTED_OUTPUT));
  });

  it('does not exit with an error', () => {
    expect(stderr).to.not.be.ok;
  });

  it('generates a project which passes linting', async () => {
    const cli = new CLIEngine({ useEslintrc: true });
    const { errorCount, warningCount, messages = [] } = cli.executeOnFiles([ACTUAL_PATH]);
    const prettyOutput = messages.map(getFileMessages).join('\n\n');
    expect(errorCount).to.equal(0, prettyOutput);
    expect(warningCount).to.equal(0, prettyOutput);
  });
});
