# Testing in IDE via Wallaby

[//]: # (AUTO INSERT HEADER PREPUBLISH)

Wallaby.js is a Plugin for your IDE and runs tests in real time while you are typing.

Using:
- In IDE Testing via [wallaby.js](https://wallabyjs.com/)

## Setup
```bash
npm init @open-wc testing-wallaby
```

### Manual
1. Copy the [config](https://github.com/open-wc/open-wc/blob/master/packages/create/src/generators/testing-wallaby/templates/static/wallaby.js) and save it as `wallaby.js` into your project root
1. `yarn add @open-wc/testing-wallaby --dev`

## Usage
Open your wallaby.js supported IDE and start with the provided config.

## Example
The [Set-Game Example](https://github.com/open-wc/example-vanilla-set-game/) has Wallaby Setup.

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/testing-wallaby/README.md';
      }
    }
  }
</script>
