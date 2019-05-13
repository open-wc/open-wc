# Chai Dom Equals

[//]: # (AUTO INSERT HEADER PREPUBLISH)

> Note: this package is deprecated, usage `@open-wc/semantic-dom-diff` which exposes a chai plugin now.

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/chai-dom-equals/README.md';
      }
    }
  }
</script>
