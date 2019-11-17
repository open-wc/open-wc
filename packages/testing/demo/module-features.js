import exportedMessage from './module-features-a.js';

export const importMetaUrl = import.meta.url;

export function dynamicImport() {
  return import('./module-features-b.js');
}

export { exportedMessage };
