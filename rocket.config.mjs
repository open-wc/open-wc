import { rocketLaunch } from '@rocket/launch';
import { rocketBlog } from '@rocket/blog';
import { rocketSearch } from '@rocket/search';
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';

export default {
  presets: [rocketLaunch(), rocketBlog(), rocketSearch()],
  emptyOutputDir: false,
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8000'),
};
