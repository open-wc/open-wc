import chai from 'chai';
import { flattenYarnLock } from '../src/flattenYarnLock';

const { expect } = chai;

describe('flattenYarnLock', () => {
  it('flattens yarn.lock data to a simple name: version object', async () => {
    const yarnLock = {
      'lit-html@1.0.0': {
        version: '1.0.0',
      },
      'lit-html@^1.0.0': {
        version: '1.1.0',
      },
    };

    const flattened = flattenYarnLock(yarnLock);

    expect(flattened).to.deep.equal({
      'lit-html': '1.0.0',
    });
  });

  it('returns an array as versions if no suitable version is found', async () => {
    const yarnLock = {
      'lit-html@^1.0.0': {
        version: '1.0.0',
      },
      'lit-html@^2.0.0': {
        version: '2.0.0',
      },
    };

    const flattened = flattenYarnLock(yarnLock);

    expect(flattened).to.deep.equal({
      'lit-html': ['1.0.0', '2.0.0'],
    });
  });
});
