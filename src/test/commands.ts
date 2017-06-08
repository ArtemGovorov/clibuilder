import { CommandSpec } from '../Command'

export const noopCommandSpec: CommandSpec = {
  name: 'noop',
  run() {
    return
  }
}

export const echoCommandSpec: CommandSpec = {
  name: 'echo',
  description: 'Echoing input arguments',
  run(argv) {
    this.ui.info(...argv)
  }
}

export const verboseCommandSpec: CommandSpec = {
  name: 'verbose',
  alias: ['vb', 'detail'],
  options: {
    boolean: {
      verbose: {
        description: 'print verbose messages'
      }
    }
  },
  run() {
    this.ui.debug('print verbosely')
  }
}

export const errorCommandSpec: CommandSpec = {
  name: 'error',
  run() {
    this.ui.error('error...')
  }
}