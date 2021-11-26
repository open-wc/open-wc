import { esbuildPlugin } from '@web/dev-server-esbuild';
import { sendKeysPlugin } from '@web/test-runner-commands/plugins';

export default {
  plugins: [
    esbuildPlugin({ ts: true, target: 'auto' }),
    sendKeysPlugin()
  ]
}
