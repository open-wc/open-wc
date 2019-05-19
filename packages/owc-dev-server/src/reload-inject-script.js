module.exports = `
  <script>
    // owc-dev-server hook to reload the browser on file change
    (function () {
      var ref;
      var eventSource = new EventSource('/__owc-dev-server-watch__');

      eventSource.addEventListener('file-changed', function (e) {
        if (ref) {
          clearTimeout(t);
        }

        ref = setTimeout(function () {
          location.reload();
        }, 200);
      });
    }());
  </script>
`;
