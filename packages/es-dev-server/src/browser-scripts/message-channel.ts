import { messageChannelEndpoint } from '../constants';

export default `
  <script>
    // sets up a message channel with es-dev-server to receive events
    // for reloading the browser on file change or logging errors
    (function () {
      if (!('EventSource' in window)) {
        return;
      }

      var eventSource = new EventSource('${messageChannelEndpoint}');
      var reloading = false;

      eventSource.addEventListener('reload', function (e) {
        reloading = true;
        location.reload();
      });

      eventSource.addEventListener('error-message', function (e) {
        if (reloading) {
          return;
        }
        
        console.error(JSON.parse(e.data));
      });

      eventSource.addEventListener('error', function () {
        if (reloading) {
          return;
        }

        eventSource.close();
        setTimeout(function () {
          console.log('Disconnected from es-dev-server, no longer reloading on file changes.');
        }, 300);
      });
    }());
  </script>
</body>
`;
