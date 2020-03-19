import { spawn } from 'child_process';
import { EventEmitter } from 'events';

import execa = require('execa');
import { formatTypescriptError } from './formatter';

export type TscProcessEvent =
  | { type: 'compiling' }
  | { type: 'compile-with-errors'; errors: Array<string> }
  | { type: 'compile-successfully' }
  | { type: 'error'; error: string };

const changeDetectedRegex = /File change detected/;
const foundErrorsRegex = /Found [1-9]+/;
const zeroErrorsRegex = /Found 0+/;
const typescriptErrorRegex = /error TS\d+:/;

const isRecompiling = (lines: Array<string>) =>
  lines.some(line => changeDetectedRegex.test(line));

const isCompileWithErrors = (lines: Array<string>) =>
  lines.some(line => foundErrorsRegex.test(line));

const isCompileSuccessfully = (lines: Array<string>) =>
  lines.some(line => zeroErrorsRegex.test(line));

const isErrorMessage = (lines: Array<string>) =>
  lines.some(line => typescriptErrorRegex.test(line));

export class TypeError extends Error {
  errors: Array<string>;

  constructor(errors: Array<string>) {
    super(errors.join('\n\n'));
    this.errors = errors;
  }
}

export default class TscProcess extends EventEmitter {
  build() {
    const tscBin = require.resolve('typescript/bin/tsc');

    return new Promise((resolve, reject) => {
      return execa('node', [tscBin])
        .then(resolve)
        .catch(({ stdout }) => {
          const lines = stdout.split('\n');
          const errors = lines
            .filter((line: string) => typescriptErrorRegex.test(line))
            .map((error: string) => formatTypescriptError(error));

          reject(new TypeError(errors));
        });
    });
  }

  watch() {
    const tscBin = require.resolve('typescript/bin/tsc');

    const tscWorker = spawn('node', [tscBin, '--watch', '--pretty', 'false']);

    process.on('exit', () => tscWorker.kill('SIGTERM'));

    let errors: Array<string> = [];

    tscWorker.stdout.on('data', buffer => {
      const lines = buffer.toString().split('\n');

      if (isErrorMessage(lines)) {
        // accumulate errors
        errors = errors.concat(
          lines.filter((line: string) => typescriptErrorRegex.test(line)),
        );
      }

      if (isRecompiling(lines)) {
        this.emit('message', { type: 'compiling' });
      }

      if (isCompileWithErrors(lines)) {
        this.emit('message', { type: 'compile-with-errors', errors });
        // after errors were sent, remove current errors from memory
        errors = [];
      }

      if (isCompileSuccessfully(lines)) {
        this.emit('message', { type: 'compile-successfully' });
      }
    });

    tscWorker.on('exit', code => {
      throw new Error(`tsc exited with code ${code}`);
    });
  }
}
