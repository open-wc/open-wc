import { html, render } from 'lit-html';
import module from './module-features-a.js';

window.__importMeta = import.meta.url.endsWith('syntax/module-features.js');
window.__staticImports = module === 'moduleFeaturesA';
window.__dynamicImports = (async () => (await import('./module-features-b.js')).default === 'moduleFeaturesB')();
