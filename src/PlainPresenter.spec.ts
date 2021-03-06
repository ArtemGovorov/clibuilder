import test from 'ava'

import { PlainPresenter, InMemoryDisplay } from './index'

test('should default to print info, warn, error messages', t => {
  const p = new PlainPresenter({ name: 'a' })
  const display = new InMemoryDisplay()
  p.display = display
  p.debug('d')
  p.error('e')
  p.warn('w')
  p.info('i')
  t.is(display.debugLogs.length, 0)
  t.is(display.warnLogs[0][0], 'w')
  t.is(display.errorLogs[0][0], 'e')
  t.is(display.infoLogs[0][0], 'i')
})

test('help message indicates default boolean option', t => {
  const p = new PlainPresenter({ name: 'a' })
  const display = new InMemoryDisplay()
  p.display = display
  p.showHelp({
    name: 'a', options: {
      boolean: { 'some-option': { description: 'some description', default: true } }
    }
  })
  t.is(display.infoLogs[0][0], `
Usage: a

Options:
  [--some-option]        some description (default true)
`)
})

test('single character option should use with single dash', t => {
  const p = new PlainPresenter({ name: 'a' })
  const display = new InMemoryDisplay()
  p.display = display
  p.showHelp({
    name: 'a', options: {
      boolean: { 'x': { description: 'some description', default: true } }
    }
  })
  t.is(display.infoLogs[0][0], `
Usage: a

Options:
  [-x]                   some description (default true)
`)
})

test('multi-character option alias should be use with double dash', t => {
  const p = new PlainPresenter({ name: 'a' })
  const display = new InMemoryDisplay()
  p.display = display
  p.showHelp({
    name: 'a', options: {
      boolean: { 'some-option': { alias: ['sopt'], description: 'some description', default: true } }
    }
  })
  t.is(display.infoLogs[0][0], `
Usage: a

Options:
  [--sopt|--some-option]  some description (default true)
`)
})

test('option and its alias should be sorted by length', t => {
  const p = new PlainPresenter({ name: 'a' })
  const display = new InMemoryDisplay()
  p.display = display
  p.showHelp({
    name: 'a', options: {
      boolean: { 'some-option': { alias: ['sopt', 'o'], description: 'some description', default: true } }
    }
  })
  t.is(display.infoLogs[0][0], `
Usage: a

Options:
  [-o|--sopt|--some-option]  some description (default true)
`)
})


test('help message indicates default string option', t => {
  const p = new PlainPresenter({ name: 'a' })
  const display = new InMemoryDisplay()
  p.display = display
  p.showHelp({
    name: 'a', options: {
      string: { 'some-option': { description: 'some description', default: 'yes' } }
    }
  })
  t.is(display.infoLogs[0][0], `
Usage: a

Options:
  [--some-option]=value  some description (default 'yes')
`)
})

test('nested command shows only top level', t => {
  const p = new PlainPresenter({ name: 'a' })
  const display = new InMemoryDisplay()
  p.display = display
  p.showHelp({
    name: 'cli',
    options: {
      string: { 'some-option': { description: 'some description', default: 'yes' } }
    },
    commands: [{
      name: 'command-1',
      commands: [{
        name: 'nested-command'
      }]
    }, {
      name: 'command-2'
    }]
  })
  t.is(display.infoLogs[0][0], `
Usage: cli <command>

Commands:
  command-1, command-2

cli <command> -h         Get help for <command>

Options:
  [--some-option]=value  some description (default 'yes')
`)
})

test('help message shows alias', t => {
  const p = new PlainPresenter({ name: 'a' })
  const display = new InMemoryDisplay()
  p.display = display
  p.showHelp({
    name: 'long-name',
    alias: ['b']
  })
  t.is(display.infoLogs[0][0], `
Usage: long-name

Alias:
  b
`)
})
