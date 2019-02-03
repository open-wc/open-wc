# Testing via Browserstack

[//]: # (AUTO INSERT HEADER PREPUBLISH)

This will run your local test via Browserstack browsers/devices.
You will need to have a Browserstack automate account.

Using:
- Karma via `@open-wc/testing-karma`
- Testing via [Browserstack](https://www.browserstack.com/) via [karma-browserstack-launcher](https://github.com/karma-runner/karma-browserstack-launcher)

::: tip
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Setup
```bash
npm i -g yo
npm i -g generator-open-wc

yo open-wc:testing-karma-bs
# follow Setup user + key
```

### Manual
- `yarn add @open-wc/testing-karma-bs --dev`
- Copy [karma.es5.bs.config.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/testing-karma-bs/templates/static/karma.es5.bs.config.js) to `karma.es5.bs.config.js`
- Add these scripts to your package.json
  ```js
  "scripts": {
    "test:es5:bs": "karma start karma.es5.bs.config.js"
  },
  ```

### Setup user + key
- Go to https://www.browserstack.com/accounts/settings
- Look for "Automate" and write down your "Access Key" and "Username"

```bash
# for one time use only
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
npm run test:es5:bs
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
