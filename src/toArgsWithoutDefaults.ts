import _ = require('lodash')

import { CliArgs, CliArgsWithoutDefaults } from './interfaces';

export function toArgsWithoutDefaults(args: CliArgs): CliArgsWithoutDefaults {
  const result = { _: [...args._] }
  Object.keys(args).forEach(k => {
    if (k === '_' || k === '_defaults')
      return
    if (args._defaults.indexOf(k) === -1) {
      if (_.isArray(args[k]))
        result[k] = [...args[k]]
      else
        result[k] = args[k]
    }
  })
  return result
}
