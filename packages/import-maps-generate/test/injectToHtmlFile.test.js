import chai from 'chai';
import fs from 'fs';
import { indexHtml, indexHtmlWithImportMap } from './assets/injectToHtmlFile/utils.js';
import injectToHtmlFile from '../src/injectToHtmlFile.js';

const { expect } = chai;

describe('injectToHtmlFile', () => {
  const importMap = JSON.stringify({ imports: { foo: 'bar' } });

  it('injects an importMap before </head> in a file', () => {
    const filePath = `${__dirname}/assets/injectToHtmlFile/index.html`;
    fs.writeFileSync(filePath, indexHtml, 'utf-8');

    injectToHtmlFile(filePath, importMap);
    const result = fs.readFileSync(filePath).toString();
    const importMapFromHtml = result.match(/<script type="importmap">(.|\n)*?<\/script>/)[0];
    expect(importMapFromHtml).to.equal(`<script type="importmap">${importMap}</script>`);

    fs.unlinkSync(filePath);
  });

  it('replaces an importMap if one already exists', () => {
    const filePath = `${__dirname}/assets/injectToHtmlFile/indexWithImportMap.html`;
    fs.writeFileSync(filePath, indexHtmlWithImportMap, 'utf-8');

    injectToHtmlFile(filePath, importMap);
    const result = fs.readFileSync(filePath).toString();
    const importMapFromHtml = result.match(/<script type="importmap">(.|\n)*?<\/script>/)[0];
    expect(importMapFromHtml).to.equal(`<script type="importmap">${importMap}</script>`);

    fs.unlinkSync(filePath);
  });

  it('injects an at the end of the file if no </head> or existing importMap is found', () => {
    const filePath = `${__dirname}/assets/injectToHtmlFile/index.html`;
    fs.writeFileSync(filePath, '', 'utf-8');

    injectToHtmlFile(filePath, importMap);
    const result = fs.readFileSync(filePath).toString();
    expect(result).to.equal(`<script type="importmap">${importMap}</script>`);

    fs.unlinkSync(filePath);
  });
});
