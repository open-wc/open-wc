import { rocketLaunch } from '@d4kmor/launch';
import { rocketBlog } from '@d4kmor/blog';
import { rocketSearch } from '@d4kmor/search';
import { absoluteBaseUrlNetlify } from '@d4kmor/core/helpers';

export default {
  presets: [rocketLaunch(), rocketBlog(), rocketSearch()],
  emptyOutputDir: false,
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8000'),
};
