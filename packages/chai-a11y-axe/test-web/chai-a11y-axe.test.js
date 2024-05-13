import { expect, use } from 'chai';
import { chaiA11yAxe } from '../index.js';

use(chaiA11yAxe);

const wrappers = [];

const getFixture = template => {
  const parentNode = document.createElement('div');
  document.body.appendChild(parentNode);
  parentNode.innerHTML = template;
  wrappers.push(parentNode);
  return parentNode.children[0];
};

describe('chai-a11y-axe', () => {
  it('exports a plugin', () => {
    expect(chaiA11yAxe).to.be.a('function');
  });

  it('should pass a11y test for accessible markup', async () => {
    const el = getFixture('<button>label</button>');
    await expect(el).to.be.accessible();
  });

  it('should NOT pass a11y test for inaccessible markup', async () => {
    const el = getFixture('<img>');
    await expect(el).not.to.be.accessible();
  });

  it('should pass a11y test with inaccessible markup with ignored offending rules', async () => {
    const el = getFixture('<img>');
    await expect(el).to.be.accessible({ ignoredRules: ['image-alt'] });
  });

  it('should pass a11t test with inaccessible markup with ignore offending tags', async () => {
    const el = getFixture(`<img>`);
    await expect(el).to.be.accessible({ ignoredTags: ['img'] });
  });

  wrappers.forEach(wrapper => {
    document.body.removeChild(wrapper);
  });
});
