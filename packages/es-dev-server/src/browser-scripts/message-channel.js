import { messageChannelEndpoint } from '../constants.js';

export default `
  <script>
    // sets up a message channel with es-dev-server to receive events
    // for reloading the browser on file change or logging errors
    (function () {
      if (!('EventSource' in window)) {
        return;
      }

      var eventSource = new EventSource('${messageChannelEndpoint}');

      eventSource.addEventListener('file-changed', function (e) {
        location.reload();
      });

      eventSource.addEventListener('error-message', function (e) {
        console.error(JSON.parse(e.data));
      });
    }());
  </script>
</body>
`;
