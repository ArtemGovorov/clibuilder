import { test } from 'ava'

import { createCommandArgs, createCliCommand, InMemoryPresenterFactory, numberOptionCommand } from '../index'


test('number option', t => {
  const args = createCommandArgs(numberOptionCommand, ['-a 3'])
  t.deepEqual(args, { a: 3, _: [], _defaults: [] })
})

test('log option', t => {
  const args = createCommandArgs(numberOptionCommand, ['-a 3'])

  const cmd = createCliCommand(numberOptionCommand, new InMemoryPresenterFactory(), {})
  t.plan(1)
  cmd.ui.info = msg => t.is(msg, `a: ${args.a}`)
  cmd.run(args, ['-a 3'])
})
