import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { constants } from 'os';

const concat = require('concat-stream');

const PATH = process.env.PATH;

//guide: https://medium.com/@zorrodg/integration-tests-on-node-js-cli-part-2-testing-interaction-user-input-6f345d4b713a

// Key codes
export const UP = '\x1B\x5B\x41',
  DOWN = '\x1B\x5B\x42',
  ENTER = '\x0D',
  SPACE = '\x20';

/**
 * Creates a child process with script path
 * @param {string} processPath Path of the process to execute
 * @param {Array} args Arguments to the command
 * @param {Object} env (optional) Environment variables
 */
function createProcess(processPath, args = [], env = null) {
  // Ensure that path exists
  if (!processPath || !existsSync(processPath)) {
    throw new Error('Invalid process path');
  }

  args = [processPath].concat(args);

  // This works for node based CLIs, but can easily be adjusted to
  // any other process installed in the system
  return spawn('node', args, {
    env: Object.assign(
      {
        NODE_ENV: 'test',
        preventAutoStart: false,
        PATH, // This is needed in order to get all the binaries in your current terminal
      },
      env,
    ),
    stdio: [null, null, null, 'ipc'], // This enables interprocess communication (IPC)
  });
}

/**
 * Creates a command and executes inputs (user responses) to the stdin
 * Returns a promise that resolves when all inputs are sent
 * Rejects the promise if any error
 * @param {string} processPath Path of the process to execute
 * @param {Array} args Arguments to the command
 * @param {Array} inputs (Optional) Array of inputs (user responses)
 * @param {Object} opts (optional) Environment variables
 * @return {Promise} promise that will be fulfilled when the process is ended
 */
export function executeWithInput(processPath, args = [], inputs = [], opts = {}) {
  if (!Array.isArray(inputs)) {
    opts = inputs;
    inputs = [];
  }

  const { env = null, timeout = 100, maxTimeout = 10000 } = opts;
  const childProcess = createProcess(processPath, args, env);
  childProcess.stdin.setDefaultEncoding('utf-8');

  let currentInputTimeout, killIOTimeout;

  // Creates a loop to feed user inputs to the child process in order to get results from the tool
  // This code is heavily inspired (if not blantantly copied) from inquirer-test:
  // https://github.com/ewnd9/inquirer-test/blob/6e2c40bbd39a061d3e52a8b1ee52cdac88f8d7f7/index.js#L14
  const loop = inputs => {
    if (killIOTimeout) {
      clearTimeout(killIOTimeout);
    }

    if (!inputs.length) {
      childProcess.stdin.end();

      // Set a timeout to wait for CLI response. If CLI takes longer than
      // maxTimeout to respond, kill the childProcess and notify user
      killIOTimeout = setTimeout(() => {
        console.error('Error: Reached I/O timeout');
        childProcess.kill(constants.signals.SIGTERM);
      }, maxTimeout);

      return;
    }

    currentInputTimeout = setTimeout(() => {
      childProcess.stdin.write(inputs[0]);
      // Log debug I/O statements on tests
      if (env && env.DEBUG) {
        console.log('input:', inputs[0]);
      }
      loop(inputs.slice(1));
    }, timeout);
  };

  const promise = new Promise((resolve, reject) => {
    // Get errors from CLI
    childProcess.stderr.on('data', data => {
      // Log debug I/O statements on tests
      if (env && env.DEBUG) {
        console.log('error:', data.toString());
      }
    });

    // Get output from CLI
    childProcess.stdout.on('data', data => {
      // Log debug I/O statements on tests
      if (env && env.DEBUG) {
        console.log('output:', data.toString());
      }
    });

    childProcess.stderr.once('data', err => {
      childProcess.stdin.end();

      if (currentInputTimeout) {
        clearTimeout(currentInputTimeout);
        inputs = [];
      }
      reject(err.toString());
    });

    childProcess.on('error', reject);

    // Kick off the process
    loop(inputs);

    childProcess.stdout.pipe(
      concat(result => {
        if (killIOTimeout) {
          clearTimeout(killIOTimeout);
        }

        resolve(result.toString());
      }),
    );
  });

  // Appending the process to the promise, in order to
  // add additional parameters or behavior (such as IPC communication)
  promise.attachedProcess = childProcess;

  return promise;
}
