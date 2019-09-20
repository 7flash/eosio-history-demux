const { describe, Try } = require('riteway')
const { createClient, createReader, createWriter, processActions } = require('../lib')

const called = {
  actionone: false,
  actiontwo: false
}
const handler = name => () => called[name] = true

const action = (name, data = {}) => ({
  account_action_seq: 1,
  action_trace: {
    act: { name, data }
  }
})

const mockClient = {
  rpc: {
    history_get_actions: () => {
      return {
        actions: [
          action('actionone'),
          action('actiontwo')
        ]
      }
    }
  }
}

describe('Module', async assert => {
  const client = createClient({
    httpEndpoint: 'httpEndpoint'
  })

  const reader = createReader({
    client: mockClient,
    contract: 'contractname'
  })

  const writer = createWriter({
    handlers: {
      'actionone': handler('actionone'),
      'actiontwo': handler('actiontwo')
    }
  })

  assert({
    given: 'connect blockchain',
    should: 'create client instance',
    actual: typeof client,
    expected: 'object'
  })

  assert({
    given: 'connect contract',
    should: 'create actions stream',
    actual: typeof reader,
    expected: 'object'
  })

  assert({
    given: 'connect handlers',
    should: 'create processor stream',
    actual: typeof writer,
    expected: 'object'
  })

  processActions({
    reader, writer,
    fromBlock: 1
  })

  setImmediate(() => {
    assert({
      given: 'process first action',
      should: 'should execute handler',
      actual: called['actionone'],
      expected: true
    })

    setImmediate(() => {
      assert({
        given: 'process first action',
        should: 'should execute handler',
        actual: called['actiontwo'],
        expected: true
      })
    })
  })
})
