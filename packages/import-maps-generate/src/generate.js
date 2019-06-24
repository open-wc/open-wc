#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import { generateFromYarnLock } from './generateFromYarnLock';
import injectToHtmlFile from './injectToHtmlFile';

const optionDefinitions = [{ name: 'inject-to' }];
const options = commandLineArgs(optionDefinitions);

export async function generate(targetPath = process.cwd()) {
  const yarnLockString = fs.readFileSync(path.resolve(targetPath, 'yarn.lock'), 'utf-8');
  const packageJsonString = fs.readFileSync(path.resolve(targetPath, 'package.json'), 'utf-8');
  const packageJson = JSON.parse(packageJsonString);

  const result = await generateFromYarnLock(yarnLockString, packageJson, targetPath);

  fs.writeFileSync('./import-map.json', JSON.stringify(result, null, 2));

  if (options['inject-to']) {
    injectToHtmlFile(options['inject-to'], JSON.stringify(result, null, 2));
  }
}

generate();
