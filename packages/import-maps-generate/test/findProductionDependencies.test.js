import chai from 'chai';
import fs from 'fs';
import {
  findProductionDependencies,
  findWorkspaceProdutionDependenies,
} from '../src/findProductionDependencies.js';

const { expect } = chai;

describe('findProductionDependencies', () => {
  it('returns only production dependencies', async () => {
    const packageJson = {
      dependencies: {
        'test-wc-card': '^0.0.3',
      },
    };

    const graph = {
      'lit-element@^2.0.1': {
        version: '2.1.0',
        dependencies: {
          'lit-html': '^1.0.0',
        },
      },
      'lit-html@1.0.0': {
        version: '1.0.0',
      },
      'test-wc-card@^0.0.3': {
        version: '0.0.3',
        dependencies: {
          'lit-element': '^2.0.1',
        },
      },
      'type-detect@^4.0.0': {
        version: '4.0.8',
      },
    };

    const deps = await findProductionDependencies(graph, {
      dependencies: packageJson.dependencies,
    });

    expect(deps).to.deep.equal({
      'lit-element@^2.0.1': {
        version: '2.1.0',
        dependencies: {
          'lit-html': '^1.0.0',
        },
      },
      'lit-html@1.0.0': {
        version: '1.0.0',
      },
      'test-wc-card@^0.0.3': {
        version: '0.0.3',
        dependencies: {
          'lit-element': '^2.0.1',
        },
      },
    });
  });
});

describe('findWorkspaceProdutionDependenies', () => {
  it('returns an object with all production dependencies', async () => {
    const targetPath = `${__dirname}/assets/exampleWorkspace/`;
    const packageJson = JSON.parse(fs.readFileSync(`${targetPath}/package.json`, 'utf-8'));

    const wsDeps = await findWorkspaceProdutionDependenies(packageJson, targetPath);
    expect(wsDeps).to.deep.equal({
      'lit-html': true,
      'lit-element': true,
    });
  });
});
