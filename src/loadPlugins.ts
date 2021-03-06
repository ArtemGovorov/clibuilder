import path = require('path')
import findup = require('find-up')

import { findPlugins } from './findPlugins'
import { CliCommand } from './CliCommand'
import { log } from './log';

export interface Registrar {
  addCommand(command: CliCommand<any, { [x: string]: any }>): void
}

class CliRegistrarImpl {
  commands: CliCommand[] = []

  addCommand(command: CliCommand) {
    this.commands.push(command)
  }
}

export async function loadPlugins(keyword, { cwd } = { cwd: '.' }) {
  log.debug('loading plugins')

  const findingLocal = findPlugins(keyword, cwd).then(pluginNames => {
    log.debug('found local plugins', pluginNames)
    return pluginNames
  })

  const globalFolder = getGlobalPackageFolder(__dirname)
  const findingGlobal = findPlugins(keyword, globalFolder).then(globalPluginNames => {
    log.debug('found global plugins', globalPluginNames)
    return globalPluginNames
  })

  return Promise.all([findingLocal, findingGlobal]).then(([pluginNames, globalPluginNames]) => {
    let commands = activatePlugins(pluginNames, cwd);

    globalPluginNames.forEach(p => {
      if (pluginNames.indexOf(p) !== -1)
        return
      const m = loadModule(p, globalFolder)
      if (isValidPlugin(m))
        commands.push(...activatePlugin(m))
    })

    return commands
  })
}

function getGlobalPackageFolder(folder): string {
  const indexToFirstNodeModulesFolder = folder.indexOf('node_modules')
  const basePath = indexToFirstNodeModulesFolder === -1 ? folder : folder.slice(0, indexToFirstNodeModulesFolder)
  // in NodeJS@6 the following fails tsc due to null is not assignable to string.
  // in this context the `findup()` call should not fail and will not return null.
  return path.resolve(findup.sync('node_modules', { cwd: basePath }) as string, '..')
}

function activatePlugins(pluginNames: string[], cwd: string) {
  const commands: CliCommand[] = []
  pluginNames
    .map(p => {
      return {
        name: p,
        pluginModule: loadModule(p, cwd)
      }
    })
    .filter(({ name, pluginModule }) => {
      if (!isValidPlugin(pluginModule)) {
        log.debug('not a valid plugin', name)
        return false
      }
      return true
    })
    .forEach(({ name, pluginModule }) => {
      log.debug('activating plugin', name)
      commands.push(...activatePlugin(pluginModule))
      log.debug('activated plugin', name)
    })
  return commands
}

function loadModule(name, cwd) {
  const pluginPath = path.resolve(cwd, 'node_modules', name)
  return require(pluginPath)
}

function isValidPlugin(m) {
  return typeof m.activate === 'function'
}

function activatePlugin(m) {
  const registrar = new CliRegistrarImpl()
  m.activate(registrar)
  return registrar.commands
}
