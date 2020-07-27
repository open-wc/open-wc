/* eslint-disable no-console, import/no-cycle */

import { spawn } from 'child_process';
import deepmerge from 'deepmerge';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import prompts from 'prompts';
import Generator from './Generator.js';

/**
 *
 * @param {Function[]} mixins
 * @param {typeof Generator} Base
 */
export async function executeMixinGenerator(mixins, options = {}, Base = Generator) {
  class Start extends Base {}
  mixins.forEach(mixin => {
    // @ts-ignore
    // eslint-disable-next-line no-class-assign
    Start = mixin(Start);
  });

  // class Do extends mixins(Base) {}
  const inst = new Start();
  inst.options = { ...inst.options, ...options };

  await inst.execute();
  if (!options.noEnd) {
    await inst.end();
  }
}

export const virtualFiles = [];

export function resetVirtualFiles() {
  virtualFiles.length = 0;
}

/**
 * Minimal template system.
 * Replaces <%= name %> if provides as template
 *
 * @example
 * processTemplate('prefix <%= name %> suffix', { name: 'foo' })
 * // prefix foo suffix
 *
 * @param {string} _fileContent Template as a string
 * @param {object} data Object of all the variables to repalce
 * @returns {string} Template with all replacements
 */
export function processTemplate(_fileContent, data = {}) {
  let fileContent = _fileContent;
  Object.keys(data).forEach(key => {
    fileContent = fileContent.replace(new RegExp(`<%= ${key} %>`, 'g'), data[key]);
  });
  return fileContent;
}

/**
 * Minimal virtual file system
 * Stores files to write in an array
 *
 * @param {string} filePath
 * @param {string} content
 */
export function writeFileToPath(filePath, content) {
  let addNewFile = true;
  virtualFiles.forEach((fileMeta, index) => {
    if (fileMeta.path === filePath) {
      virtualFiles[index].content = content;
      addNewFile = false;
    }
  });
  if (addNewFile === true) {
    virtualFiles.push({ path: filePath, content });
  }
}

/**
 *
 * @param {string} filePath
 */
export function readFileFromPath(filePath) {
  let content = false;
  virtualFiles.forEach((fileMeta, index) => {
    if (fileMeta.path === filePath) {
      // eslint-disable-next-line prefer-destructuring
      content = virtualFiles[index].content;
    }
  });
  if (content) {
    return content;
  }
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return false;
}

/**
 *
 * @param {string} filePath
 */
export function deleteVirtualFile(filePath) {
  const index = virtualFiles.findIndex(fileMeta => fileMeta.path === filePath);
  if (index !== -1) {
    virtualFiles.splice(index, 1);
  }
}

let overwriteAllFiles = false;

/**
 *
 * @param {boolean} value
 */
export function setOverrideAllFiles(value) {
  overwriteAllFiles = value;
}

/**
 *
 * @param {string} toPath
 * @param {string} fileContent
 * @param {object} obj Options
 */
export async function writeFileToPathOnDisk(
  toPath,
  fileContent,
  { override = false, ask = true } = {},
) {
  const toPathDir = path.dirname(toPath);
  if (!fs.existsSync(toPathDir)) {
    fs.mkdirSync(toPathDir, { recursive: true });
  }
  if (fs.existsSync(toPath)) {
    if (override || overwriteAllFiles) {
      fs.writeFileSync(toPath, fileContent);
    } else if (ask) {
      let wantOverride = overwriteAllFiles;
      if (!wantOverride) {
        const answers = await prompts(
          [
            {
              type: 'select',
              name: 'overwriteFile',
              message: `Do you want to overwrite ${toPath}?`,
              choices: [
                { title: 'Yes', value: 'true' },
                {
                  title: 'Yes for all files',
                  value: 'always',
                },
                { title: 'No', value: 'false' },
              ],
            },
          ],
          {
            onCancel: () => {
              process.exit();
            },
          },
        );
        if (answers.overwriteFile === 'always') {
          setOverrideAllFiles(true);
          wantOverride = true;
        }
        if (answers.overwriteFile === 'true') {
          wantOverride = true;
        }
      }
      if (wantOverride) {
        fs.writeFileSync(toPath, fileContent);
      }
    }
  } else {
    fs.writeFileSync(toPath, fileContent);
  }
}

/**
 * @param {String[]} allFiles pathes to files
 * @param {Number} [level] internal to track nesting level
 */
export function filesToTree(allFiles, level = 0) {
  const files = allFiles.filter(file => !file.includes('/'));
  const dirFiles = allFiles.filter(file => file.includes('/'));

  let indent = '';
  for (let i = 1; i < level; i += 1) {
    indent += '│   ';
  }

  let output = '';
  const processed = [];

  if (dirFiles.length > 0) {
    dirFiles.forEach(dirFile => {
      if (!processed.includes(dirFile)) {
        const dir = `${dirFile.split('/').shift()}/`;
        const subFiles = [];
        allFiles.forEach(file => {
          if (file.startsWith(dir)) {
            subFiles.push(file.substr(dir.length));
            processed.push(file);
          }
        });
        output += level === 0 ? `${dir}\n` : `${indent}├── ${dir}\n`;
        output += filesToTree(subFiles, level + 1);
      }
    });
  }

  if (files.length === 1) {
    output += `${indent}└── ${files[0]}\n`;
  }
  if (files.length > 1) {
    const last = files.pop();
    output += `${indent}├── `;
    output += files.join(`\n${indent}├── `);
    output += `\n${indent}└── ${last}\n`;
  }
  return output;
}

/**
 *
 */
export async function writeFilesToDisk() {
  const treeFiles = [];
  const root = process.cwd();
  virtualFiles.sort((a, b) => {
    const pathA = a.path.toLowerCase();
    const pathB = b.path.toLowerCase();
    if (pathA < pathB) return -1;
    if (pathA > pathB) return 1;
    return 0;
  });

  virtualFiles.forEach(vFile => {
    if (vFile.path.startsWith(root)) {
      let vFilePath = './';
      vFilePath += vFile.path.substr(root.length + 1);
      treeFiles.push(vFilePath);
    }
  });

  console.log('');
  console.log(filesToTree(treeFiles));

  const answers = await prompts(
    [
      {
        type: 'select',
        name: 'writeToDisk',
        message: 'Do you want to write this file structure to disk?',
        choices: [
          { title: 'Yes', value: 'true' },
          { title: 'No', value: 'false' },
        ],
      },
    ],
    {
      onCancel: () => {
        process.exit();
      },
    },
  );

  if (answers.writeToDisk === 'true') {
    // eslint-disable-next-line no-restricted-syntax
    for (const fileMeta of virtualFiles) {
      // eslint-disable-next-line no-await-in-loop
      await writeFileToPathOnDisk(fileMeta.path, fileMeta.content);
    }
    console.log('Writing..... done');
  }

  return answers.writeToDisk;
}

export function optionsToCommand(options, generatorName = '@open-wc') {
  let command = `npm init ${generatorName} `;
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (typeof value === 'string' || typeof value === 'number') {
      command += `--${key} ${value} `;
    } else if (typeof value === 'boolean' && value === true) {
      command += `--${key} `;
    } else if (Array.isArray(value)) {
      command += `--${key} ${value.join(' ')} `;
    }
  });
  return command;
}

/**
 *
 * @param {string} fromPath
 * @param {string} toPath
 * @param {object} data
 */
export function copyTemplate(fromPath, toPath, data) {
  const fileContent = readFileFromPath(fromPath);
  if (fileContent) {
    const processed = processTemplate(fileContent, data);
    writeFileToPath(toPath, processed);
  }
}

/**
 *
 * @param {string} fromGlob
 * @param {string} [toDir] Directory to copy into
 * @param {object} data Replace parameters in files
 */
export function copyTemplates(fromGlob, toDir = process.cwd(), data = {}) {
  return new Promise(resolve => {
    glob(fromGlob, { dot: true }, (er, files) => {
      const copiedFiles = [];
      files.forEach(filePath => {
        if (!fs.lstatSync(filePath).isDirectory()) {
          const fileContent = readFileFromPath(filePath);
          if (fileContent !== false) {
            const processed = processTemplate(fileContent, data);

            // find path write to (force / also on windows)
            const replace = path.join(fromGlob.replace(/\*/g, '')).replace(/\\(?! )/g, '/');
            const toPath = filePath.replace(replace, `${toDir}/`);

            copiedFiles.push({ toPath, processed });
            writeFileToPath(toPath, processed);
          }
        }
      });
      resolve(copiedFiles);
    });
  });
}

/**
 *
 * @param {string} fromPath
 * @param {string} toPath
 * @param {object} data
 */
export function copyTemplateJsonInto(
  fromPath,
  toPath,
  data = {},
  { mode = 'merge' } = { mode: 'merge' },
) {
  const content = readFileFromPath(fromPath);
  if (content === false) {
    return;
  }
  const processed = processTemplate(content, data);
  const mergeMeObj = JSON.parse(processed);

  const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

  const emptyTarget = value => (Array.isArray(value) ? [] : {});
  const clone = (value, options) => deepmerge(emptyTarget(value), value, options);

  const combineMerge = (target, source, options) => {
    const destination = target.slice();

    source.forEach((item, index) => {
      if (typeof destination[index] === 'undefined') {
        const cloneRequested = options.clone !== false;
        const shouldClone = cloneRequested && options.isMergeableObject(item);
        destination[index] = shouldClone ? clone(item, options) : item;
      } else if (options.isMergeableObject(item)) {
        destination[index] = deepmerge(target[index], item, options);
      } else if (target.indexOf(item) === -1) {
        destination.push(item);
      }
    });
    return destination;
  };

  const mergeOptions = { arrayMerge: combineMerge };
  if (mode === 'override') {
    mergeOptions.arrayMerge = overwriteMerge;
  }

  let finalObj = mergeMeObj;
  const sourceContent = readFileFromPath(toPath);
  if (sourceContent) {
    finalObj = deepmerge(JSON.parse(sourceContent), finalObj, mergeOptions);
  }

  writeFileToPath(toPath, JSON.stringify(finalObj, null, 2));
}

/**
 * @param {string} command
 * @param {object} options
 */
function _install(command = 'npm', options) {
  return new Promise(resolve => {
    const install = spawn(command, ['install'], options);
    install.stdout.on('data', data => {
      console.log(`${data}`.trim());
    });

    install.stderr.on('data', data => {
      console.log(`${command}: ${data}`);
    });

    install.on('close', () => {
      resolve();
    });
  });
}

/**
 *
 * @param {string} where
 * @param {string} command
 */
export async function installNpm(where, command) {
  console.log('');
  console.log('Installing dependencies...');
  console.log('This might take some time...');
  console.log(`Using ${command} to install...`);
  await _install(command, { cwd: where, shell: true });
  console.log('');
}
