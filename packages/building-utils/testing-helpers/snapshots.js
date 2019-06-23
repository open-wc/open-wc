/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const { expect } = require('chai');

const shouldUpdateSnapshots = process.argv.includes('--update-snapshots');

/**
 * Scans directory recursively and checks whether all files are present
 * in the build output.
 *
 * @param {string} rootDir
 * @param {string} dir
 * @param {{ [key: string]: string }} outputFiles
 */
function checkFilesInDirectory(rootDir, dir, outputFiles) {
  fs.readdirSync(dir).forEach(fileOrDirName => {
    const fileOrDir = path.join(dir, fileOrDirName);

    if (fs.statSync(fileOrDir).isDirectory()) {
      checkFilesInDirectory(rootDir, fileOrDir, outputFiles);
    } else {
      const relativePath = path.relative(rootDir, fileOrDir);
      if (!(relativePath in outputFiles)) {
        throw new Error(`Expected ${relativePath} file in build output.`);
      }
    }
  });
}

/**
 *
 * @param {string} snapshotDir
 * @param {{ [key: string]: string }} outputFiles
 */
function checkOutputSource(snapshotDir, outputFiles) {
  Object.entries(outputFiles).forEach(([file, code]) => {
    const filePath = path.join(snapshotDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Did not find file ${filePath} in snapshot output. Is it new?`);
    }

    if (fs.statSync(filePath).isDirectory()) {
      throw new Error(`File at ${filePath} in snapshot is a directory, expected a file.`);
    }

    const snapshotCode = fs.readFileSync(filePath, 'utf-8');
    expect(snapshotCode).to.equal(code, `File output at: ${filePath} differs from snapshot: `);
  });
}

/**
 * Compares build output with snapshot on filesystem.
 *
 * @param {string} snapshotDir
 * @param {{ [key: string]: string }} outputFiles
 */
function compareSnapshot(snapshotDir, outputFiles) {
  if (!fs.existsSync(snapshotDir) || fs.readdirSync(snapshotDir).length === 0) {
    throw new Error(`Did not find any stored snapshot at: ${snapshotDir}`);
  }

  checkFilesInDirectory(snapshotDir, snapshotDir, outputFiles);
  checkOutputSource(snapshotDir, outputFiles);
}

/**
 * Updates snapshots on the filesystem.
 *
 * @param {string} snapshotDir
 * @param {{ [key: string]: string }} outputFiles
 */
function updateSnapshots(snapshotDir, outputFiles) {
  rimraf.sync(snapshotDir);
  Object.entries(outputFiles).forEach(([filename, code]) => {
    const filePath = path.join(snapshotDir, filename);
    mkdirp.sync(path.dirname(filePath));
    fs.writeFileSync(path.join(snapshotDir, filename), code);
  });
}

/**
 * Updates or compares snapshots.
 *
 * @param {string} snapshotDir
 * @param {{ [key: string]: string }} outputFiles
 * @param {boolean} _shouldUpdateSnapshots
 */
function testSnapshots(snapshotDir, outputFiles, _shouldUpdateSnapshots = shouldUpdateSnapshots) {
  if (_shouldUpdateSnapshots) {
    updateSnapshots(snapshotDir, outputFiles);
  } else {
    compareSnapshot(snapshotDir, outputFiles);
  }
}

module.exports = {
  compareSnapshot,
  updateSnapshots,
  testSnapshots,
};
