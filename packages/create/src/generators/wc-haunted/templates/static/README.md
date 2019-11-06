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

## Local Demo with `es-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`

```bash
npm start:compatibility
```
To run a local development server in compatibility mode for older browsers that serves the basic demo located in `demo/index.html`