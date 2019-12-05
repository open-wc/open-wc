import { html, render } from 'lit-html';
import module from './module-features-a.js';

window.__importMeta = import.meta.url.indexOf('syntax/module-features.js') > 0;
window.__staticImports = module === 'moduleFeaturesA';
window.__dynamicImports = (async () => (await import('./module-features-b.js')).default === 'moduleFeaturesB')();
