import chai from 'chai';
import fs from 'fs';
import { indexHtml, indexHtmlWithImportMap } from './assets/injectToHtmlFile/utils';
import injectToHtmlFile from '../src/injectToHtmlFile';

const { expect } = chai;

describe('injectToHtmlFile', () => {
  const importMap = JSON.stringify({ imports: { foo: 'bar' } });

  it('injects an importmap before </head> in a file', () => {
    const filePath = `${__dirname}/assets/injectToHtmlFile/index.html`;
    fs.writeFileSync(filePath, indexHtml, 'utf-8');

    injectToHtmlFile(filePath, importMap);
    const result = fs.readFileSync(filePath).toString();
    const importMapFromHtml = result.match(/<script type="importmap">(.|\n)*?<\/script>/)[0];
    expect(importMapFromHtml).to.equal(`<script type="importmap">${importMap}</script>`);

    fs.unlinkSync(filePath);
  });

  it('replaces an importmap if one already exists', () => {
    const filePath = `${__dirname}/assets/injectToHtmlFile/indexWithImportMap.html`;
    fs.writeFileSync(filePath, indexHtmlWithImportMap, 'utf-8');

    injectToHtmlFile(filePath, importMap);
    const result = fs.readFileSync(filePath).toString();
    const importMapFromHtml = result.match(/<script type="importmap">(.|\n)*?<\/script>/)[0];
    expect(importMapFromHtml).to.equal(`<script type="importmap">${importMap}</script>`);

    fs.unlinkSync(filePath);
  });

  it('injects an at the end of the file if no </head> or existing importmap is found', () => {
    const filePath = `${__dirname}/assets/injectToHtmlFile/index.html`;
    fs.writeFileSync(filePath, '', 'utf-8');

    injectToHtmlFile(filePath, importMap);
    const result = fs.readFileSync(filePath).toString();
    expect(result).to.equal(`<script type="importmap">${importMap}</script>`);

    fs.unlinkSync(filePath);
  });
});
