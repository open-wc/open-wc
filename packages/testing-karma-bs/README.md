# Testing via Browserstack

[//]: # (AUTO INSERT HEADER PREPUBLISH)

To make sure your project is production-ready, we recommend running tests in all the browsers you want to support.

If you do not have access to all browsers, we recommend using a service like [Browserstack](https://www.browserstack.com/) to make sure your project works as intended.
Browserstack offers free accounts for [open source projects](https://www.browserstack.com/open-source).

The `testing-karma-bs` configuration helps setting up karma with Browserstack. To set it up you need to use the configuration in your project, and follow the instructions below to set up a user account

## Setup
With our project scaffolding you can set up a pre-configured project, or you can upgrade an existing project by choosing `Upgrade -> Testing`:
```bash
npm init @open-wc
```

### Manual
Install:
```bash
npm i -D @open-wc/testing-karma-bs deepmerge
```

Add a `karma.conf.bs.js`:

```javascript
const merge = require('deepmerge');
const { bsSettings } = require('@open-wc/testing-karma-bs');
const createBaseConfig = require('./karma.conf.js');

module.exports = config => {
  config.set(
    merge(bsSettings(config), createBaseConfig(config), {
      browserStack: {
        project: 'your-name',
      },
    }),
  );

  return config;
};
```

Add a script to your `package.json`:
```json
{
  "scripts": {
    "test:bs": "karma start karma.bs.config.js --compatibility all --coverage"
  }
}
```

### Setup user + key
- Go to [https://www.browserstack.com/accounts/settings](https://www.browserstack.com/accounts/settings)
- Look for "Automate" and write down your "Access Key" and "Username"

```bash
# for one-time use only
export BROWSER_STACK_USERNAME=xxx
export BROWSER_STACK_ACCESS_KEY=xxx

# or add them to your .bashrc
echo "export BROWSER_STACK_USERNAME=xxx" >> ~/.bashrc
echo "export BROWSER_STACK_ACCESS_KEY=xxx" >> ~/.bashrc

# to verify, run:
echo "User: $BROWSER_STACK_USERNAME"
echo "Key: $BROWSER_STACK_ACCESS_KEY"
```

### Usage
```bash
npm run test:bs
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/testing-karma-bs/README.md';
      }
    }
  }
</script>
