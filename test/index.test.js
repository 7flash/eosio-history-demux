const { describe, Try } = require('riteway')
const { createClient, createReducer } = require('../lib')

const called = {
  actionone: false,
  actiontwo: false,
  actionthree: false,
  actionfour: false,
  actionfive: false,
  newaction: false
}
const handler = name => () => called[name] = true

const action = (name, data = {}) => ({
  account_action_seq: 1,
  action_trace: {
    act: { name, data }
  }
})

const createMockClient = (actions, offset = 1) => {
  let historyActions = actions

  return {
    rpc: {
      history_get_actions: (contract, pos, offset) => {
        return {
          actions: historyActions.slice(pos, offset)
        }
      }
    },
    pushAction: (action) => historyActions.push(action)
  }
}

describe.only('Idle', async assert => {
  const mockClient = createMockClient([])

  const reducer = createReducer({
    client: mockClient,
    contract: 'demo',
    handlers: {
      'newaction': handler('newaction')
    }
  })

  setImmediate(() => {
    assert({
      given: 'empty response',
      should: 'should wait until new actions',
      actual: called['newaction'],
      expected: false
    })

    mockClient.pushAction(action('newaction'))

    setTimeout(() => {
      assert({
        given: 'new action in history',
        should: 'handle new action',
        actual: called['newaction'],
        expected: true
      })

      reducer.stop()
    }, 1000)
  })
})
describe('Backpressure', async assert => {
  const mockClient = createMockClient([
    action('actionone'),
    action('actiontwo'),
    action('actionthree'),
    action('actionfour'),
    action('actionfive')
  ], 3)

  const reducer = createReducer({
    client: mockClient,
    contract: 'demo',
    handlers: {
      'actionone': handler('actionone'),
      'actiontwo': handler('actiontwo'),
      'actionthree': handler('actionthree'),
      'actionfour': handler('actionfour'),
      'actionfive': handler('actionfive')
    },
    highWaterMark: 2
  })

  setImmediate(() => {
    assert({
      given: 'multiple actions in response',
      should: 'process all actions sequentially and send another request when buffer is empty',
      actual: Object.keys(called).filter(fn => called[fn] === true).length,
      expected: 5
    })

    reducer.stop()
  })
})
