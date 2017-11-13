import { test } from 'ava'
import { setupCommandTest, argCommand, stringOptionCommand } from '../index'


test('string option with space', t => {
  const { args } = setupCommandTest(stringOptionCommand, ['-a 3'])

  t.deepEqual(args, { a: '3', _: [], _defaults: [] })
})

test('string option with =', t => {
  const { args } = setupCommandTest(stringOptionCommand, ['-a=abc'])

  t.deepEqual(args, { a: 'abc', _: [], _defaults: [] })
})

test('string option without space', t => {
  const { args } = setupCommandTest(stringOptionCommand, ['-a5'])

  t.deepEqual(args, { a: '5', _: [], _defaults: [] })
})

test('log option', t => {
  const { cmd, args, argv, ui } = setupCommandTest(stringOptionCommand, ['-a 3'])

  cmd.run(args, argv)

  t.is(ui.display.infoLogs[0][0], 'a: 3')
})

test('argument command', t => {
  const { cmd, args, argv, ui } = setupCommandTest(argCommand, ['abc'])

  t.deepEqual(args, { _: [], _defaults: [], 'some-arg': 'abc' })

  cmd.run(args, argv)
  t.is(ui.display.infoLogs[0][0], 'some-arg: abc')
})
