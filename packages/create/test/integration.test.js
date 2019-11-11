import _rimraf from 'rimraf';
import chai from 'chai';
import chaiFs from 'chai-fs';
import { exec as _exec } from 'child_process';
import { promisify } from 'util';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const exec = promisify(_exec);

const rimraf = promisify(_rimraf);

const { expect } = chai;

chai.use(chaiFs);

const COMMAND_PATH = join(__dirname, '../src/create.js');

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
  expect(actualPath)
    .to.be.a.file()
    .and.equal(expectedPath);
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

describe('create', () => {
  // For some reason, this doesn't do anything
  const destinationPath = join(__dirname, './output');

  beforeEach(deleteGenerated);
  afterEach(deleteGenerated);

  it('generates a fully loaded app project', async () => {
    const EXPECTED_PATH = join(__dirname, './snapshots/fully-loaded-app');

    const EXPECTED_OUTPUT = readFileSync(
      join(EXPECTED_PATH, '../fully-loaded-app.output.txt'),
      'utf-8',
    );

    const { stdout } = await exec(` \
      node -r @babel/register ${COMMAND_PATH} \
        --destinationPath ${destinationPath} \
        --type scaffold \
        --scaffoldType app \
        --features linting testing demoing building \
        --buildingType rollup \
        --scaffoldFilesFor testing demoing building \
        --tagName scaffold-app \
        --writeToDisk true \
        --installDependencies false
    `);

    // Check that all files exist, without checking their contents
    expect(ACTUAL_PATH)
      .to.be.a.directory()
      .and.deep.equal(EXPECTED_PATH);

    // check file contents
    checkSnapshotContents(EXPECTED_PATH, ACTUAL_PATH);

    expect(stripUserDir(stdout)).to.equal(stripUserDir(EXPECTED_OUTPUT));
  });
});
