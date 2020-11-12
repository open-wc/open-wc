import { rocketLaunch } from '@d4kmor/launch';
import { rocketSearch } from '@d4kmor/search';
import { absoluteBaseUrlNetlify } from '@d4kmor/core/helpers';

export default {
  themes: [rocketLaunch(), rocketSearch()],
  build: {
    emptyOutputDir: false,
    absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
  },
};
