import chai from 'chai';
import fs from 'fs';
import {
  generateFromYarnLock,
  resolvePathsAndConflicts,
  flatResolvedDepsToImports,
} from '../src/generateFromYarnLock';

const { expect } = chai;

describe('resolvePathsAndConflicts', () => {
  it('will resolve conflicts via a resolution map', async () => {
    const flattened = await resolvePathsAndConflicts(
      {
        'lit-html': ['0.14.0', '1.1.0'],
      },
      {
        'lit-element@^2.0.0': {
          version: '2.1.0',
          dependencies: {
            'lit-html': '^1.0.0',
          },
        },
        'lit-html@^0.14.0': {
          version: '0.14.0',
        },
        'lit-html@^1.0.0': {
          version: '1.1.0',
        },
      },
      {
        importMap: {
          resolutions: {
            'lit-html': '1.1.0',
          },
        },
      },
      `${__dirname}/assets/exampleNestedResolution/`,
    );

    expect(flattened).to.deep.equal({
      'lit-html': '/node_modules/lit-element/node_modules/lit-html/lit-html.js',
    });
  });
});

describe('flatResolvedDepsToImports', () => {
  it('converts resolved package entry files to imports for subfiles', async () => {
    const flatResolvedDeps = {
      'lit-element': '/node_modules/lit-element/lit-element.js',
      'lit-html': '/node_modules/lit-element/node_modules/lit-html/lit-html.js',
    };
    const importMap = flatResolvedDepsToImports(flatResolvedDeps);

    expect(importMap).to.deep.equal({
      'lit-element': '/node_modules/lit-element/lit-element.js',
      'lit-element/': '/node_modules/lit-element/',
      'lit-html': '/node_modules/lit-element/node_modules/lit-html/lit-html.js',
      'lit-html/': '/node_modules/lit-element/node_modules/lit-html/',
    });
  });
});

describe('generateFromYarnLock', () => {
  it('generates an import map for a flat yarn.lock file', async () => {
    const targetPath = `${__dirname}/assets/example/`;
    const yarnLockString = fs.readFileSync(`${targetPath}/yarn.lock`, 'utf-8');
    const packageJson = JSON.parse(fs.readFileSync(`${targetPath}/package.json`, 'utf-8'));

    const importMap = await generateFromYarnLock(yarnLockString, packageJson, targetPath);

    expect(importMap).to.deep.equal({
      imports: {
        'lit-element': '/node_modules/lit-element/lit-element.js',
        'lit-element/': '/node_modules/lit-element/',
        'lit-html': '/node_modules/lit-html/lit-html.js',
        'lit-html/': '/node_modules/lit-html/',
      },
    });
  });

  it('generates a flat import map for nested dependencies if possible', async () => {
    const targetPath = `${__dirname}/assets/exampleNested/`;
    const yarnLockString = fs.readFileSync(`${targetPath}/yarn.lock`, 'utf-8');
    const packageJson = JSON.parse(fs.readFileSync(`${targetPath}/package.json`, 'utf-8'));

    const importMap = await generateFromYarnLock(yarnLockString, packageJson, targetPath);

    expect(importMap).to.deep.equal({
      imports: {
        'lit-element': '/node_modules/lit-element/lit-element.js',
        'lit-element/': '/node_modules/lit-element/',
        'lit-html': '/node_modules/lit-html/lit-html.js',
        'lit-html/': '/node_modules/lit-html/',
      },
    });
  });

  it('generates a flat import map for nested dependencies if resolutions are provided', async () => {
    const targetPath = `${__dirname}/assets/exampleNestedResolution/`;
    const yarnLockString = fs.readFileSync(`${targetPath}/yarn.lock`, 'utf-8');
    const packageJson = JSON.parse(fs.readFileSync(`${targetPath}/package.json`, 'utf-8'));

    const importMap = await generateFromYarnLock(yarnLockString, packageJson, targetPath);

    expect(importMap).to.deep.equal({
      imports: {
        'lit-element': '/node_modules/lit-element/lit-element.js',
        'lit-element/': '/node_modules/lit-element/',
        'lit-html': '/node_modules/lit-element/node_modules/lit-html/lit-html.js',
        'lit-html/': '/node_modules/lit-element/node_modules/lit-html/',
      },
    });
  });
});

describe('generateFromYarnLock supports yarn workspaces', () => {
  it('generates a flat import map by default', async () => {
    const targetPath = `${__dirname}/assets/exampleWorkspace/`;
    const yarnLockString = fs.readFileSync(`${targetPath}/yarn.lock`, 'utf-8');
    const packageJson = JSON.parse(fs.readFileSync(`${targetPath}/package.json`, 'utf-8'));

    const importMap = await generateFromYarnLock(yarnLockString, packageJson, targetPath);

    expect(importMap).to.deep.equal({
      imports: {
        'lit-element': '/node_modules/lit-element/lit-element.js',
        'lit-element/': '/node_modules/lit-element/',
        'lit-html': '/node_modules/lit-html/lit-html.js',
        'lit-html/': '/node_modules/lit-html/',
        '@example/a': '/packages/a/a.js',
        '@example/a/': '/packages/a/',
        b: '/packages/b/b.js',
        'b/': '/packages/b/',
      },
    });
  });

  it('generates a flat import map for semver possible nested dependencies', async () => {
    const targetPath = `${__dirname}/assets/exampleWorkspaceNested/`;
    const yarnLockString = fs.readFileSync(`${targetPath}/yarn.lock`, 'utf-8');
    const packageJson = JSON.parse(fs.readFileSync(`${targetPath}/package.json`, 'utf-8'));

    const importMap = await generateFromYarnLock(yarnLockString, packageJson, targetPath);

    expect(importMap).to.deep.equal({
      imports: {
        'lit-element': '/node_modules/lit-element/lit-element.js',
        'lit-element/': '/node_modules/lit-element/',
        'lit-html': '/node_modules/lit-html/lit-html.js',
        'lit-html/': '/node_modules/lit-html/',
        '@example/a': '/packages/a/a.js',
        '@example/a/': '/packages/a/',
        b: '/packages/b/b.js',
        'b/': '/packages/b/',
      },
    });
  });

  it('generates a flat import map for semver impossible nested dependencies with a resolution', async () => {
    const targetPath = `${__dirname}/assets/exampleWorkspaceNestedResolution/`;
    const yarnLockString = fs.readFileSync(`${targetPath}/yarn.lock`, 'utf-8');
    const packageJson = JSON.parse(fs.readFileSync(`${targetPath}/package.json`, 'utf-8'));

    const importMap = await generateFromYarnLock(yarnLockString, packageJson, targetPath);

    expect(importMap).to.deep.equal({
      imports: {
        'lit-element': '/node_modules/lit-element/lit-element.js',
        'lit-element/': '/node_modules/lit-element/',
        'lit-html': '/packages/b/node_modules/lit-html/lit-html.js',
        'lit-html/': '/packages/b/node_modules/lit-html/',
        '@example/a': '/packages/a/a.js',
        '@example/a/': '/packages/a/',
        b: '/packages/b/b.js',
        'b/': '/packages/b/',
      },
    });
  });
});
