import createDefaultConfig from '@open-wc/building-rollup/modern-config';

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

export default createDefaultConfig({ input: './index.html' });
