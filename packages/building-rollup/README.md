# Rollup

[//]: # (AUTO INSERT HEADER PREPUBLISH)

TODO

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/building-rollup/README.md';
      }
    }
  }
</script>
