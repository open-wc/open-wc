import { expect } from 'chai';
import { isModernBrowser } from '../../src/utils/is-modern-browser.js';

describe('isModernBrowser()', () => {
  const testCases = [
    {
      name: 'Chrome 79',
      agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3987.132 Safari/537.36',
      modern: false,
    },

    {
      name: 'Edge 79',
      agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3987.132 Safari/537.36 Edg/79',
      modern: false,
    },

    {
      name: 'Firefox 73',
      agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:73.0) Gecko/20100101 Firefox/73.0',
      modern: false,
    },
    {
      name: 'Firefox 74',
      agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:73.0) Gecko/20100101 Firefox/73.0',
      modern: false,
    },

    {
      name: 'iOS 12',
      agent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
      modern: false,
    },
    {
      name: 'iOS 12.1',
      agent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
      modern: false,
    },
    {
      name: 'iOS 13',
      agent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1',
      modern: false,
    },
    {
      name: 'Safari 11',
      agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
      modern: false,
    },
    {
      name: 'Safari 12',
      agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15',
      modern: false,
    },
    {
      name: 'Safari 12.1',
      agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
      modern: false,
    },
    {
      name: 'Safari 13',
      agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15',
      modern: false,
    },

    {
      name: 'Higher Chrome version',
      agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/9999.0.3987.132 Safari/537.36',
      modern: true,
    },
  ];

  for (const testCase of testCases) {
    it(`Returns ${testCase.modern} for ${testCase.name}`, () => {
      expect(isModernBrowser(testCase.agent)).to.equal(testCase.modern);
    });
  }
});
