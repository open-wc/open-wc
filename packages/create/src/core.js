/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import util from 'util';
import { exec, spawn } from 'child_process';

import glob from 'glob';
import deepmerge from 'deepmerge';

import Generator from './Generator.js';

import { cliOptions } from './helpers.js';

const execAsync = util.promisify(exec);

export async function executeMixinGenerator(Mixin) {
  class Do extends Mixin(Generator) {}
  const inst = new Do();

  await inst.execute();
  await inst.end();
}

function processTemplate(_fileContent, data = {}) {
  let fileContent = _fileContent;
  // TODO: fake template for now - find a small one? really needed? worth the cost?
  Object.keys(data).forEach(key => {
    fileContent = fileContent.replace(new RegExp(`<%= ${key} %>`, 'g'), data[key]);
  });
  return fileContent;
}

function writeFileToPath(toPath, fileContent) {
  // TODO: direct write for now => should be a virtual file system? (is it worth the heavy weight?)
  // maybe a message: "Upgrade generators will override files - are you sure?"" is enough?
  const toPathDir = path.dirname(toPath);
  if (!fs.existsSync(toPathDir)) {
    fs.mkdirSync(toPathDir, { recursive: true });
  }
  fs.writeFileSync(toPath, fileContent);
  console.log(`Writing ${toPath}.`);
}

export function copyTemplate(fromPath, toPath, data) {
  const fileContent = fs.readFileSync(fromPath, 'utf-8');
  const processed = processTemplate(fileContent, data);
  writeFileToPath(toPath, processed);
}

export function copyTemplates(fromGlob, toDir = process.cwd(), data = {}) {
  return new Promise(resolve => {
    glob(fromGlob, { dot: true }, (er, files) => {
      files.forEach(filePath => {
        if (!fs.lstatSync(filePath).isDirectory()) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const processed = processTemplate(fileContent, data);

          // find path write to
          const replace = path.join(fromGlob.replace(/\*/g, ''));
          const toPath = filePath.replace(replace, `${toDir}/`);

          writeFileToPath(toPath, processed);
        }
      });
      resolve();
    });
  });
}

export function copyTemplateJsonInto(fromPath, toPath, data = {}) {
  const processed = processTemplate(fs.readFileSync(fromPath, 'utf-8'), data);
  const mergeMeObj = JSON.parse(processed);

  const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

  let finalObj = mergeMeObj;
  if (fs.existsSync(toPath)) {
    const fileContent = fs.readFileSync(toPath, 'utf-8');
    finalObj = deepmerge(JSON.parse(fileContent), finalObj, { arrayMerge: overwriteMerge });
  }

  writeFileToPath(toPath, JSON.stringify(finalObj, null, 2));
  console.log(`Writing ${toPath}.`);
}

function _install(command = 'npm', options) {
  return new Promise(resolve => {
    const install = spawn(command, ['install'], options);
    install.stdout.on('data', data => {
      console.log(`${data}`.trim());
    });

    install.stderr.on('data', data => {
      console.log(`Error: ${data}`);
    });

    install.on('close', () => {
      resolve();
    });
  });
}

export async function installNpm(where) {
  if (!cliOptions['no-npm']) {
    console.log('');
    console.log('Installing dependencies...');
    console.log('This might take some time...');

    const { stdout } = await execAsync('command -v yarn');
    let command = 'npm';
    if (stdout !== '') {
      command = 'yarn';
    }
    console.log(`Using ${command} to install...`);

    await _install(command, { cwd: where });
    console.log('');
  }
}
