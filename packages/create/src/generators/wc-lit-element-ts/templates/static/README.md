# \<<%= tagName %>>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
npm i <%= tagName %>
```

## Usage
```html
<script type="module">
  import '<%= tagName %>/<%= tagName %>.js';
</script>

<<%= tagName %>></<%= tagName %>>
```

<%= featureReadmes %>

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `es-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`
