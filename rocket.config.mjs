import { rocketLaunch } from '@rocket/launch';
import { rocketBlog } from '@rocket/blog';
import { rocketSearch } from '@rocket/search';
import { codeTabs } from 'rocket-preset-code-tabs';
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';

export default {
  presets: [rocketLaunch(), rocketBlog(), rocketSearch(), codeTabs({
    collections: {
      packageManagers: {
        npm: { label: 'NPM', iconHref: '/_merged_assets/_static/logos/npm.svg' },
        yarn: { label: 'Yarn', iconHref: '/_merged_assets/_static/logos/yarn.svg' },
        pnpm: { label: 'PNPM', iconHref: '/_merged_assets/_static/logos/pnpm.svg' },
      },
    }
  })],
  emptyOutputDir: false,
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8000'),
};
