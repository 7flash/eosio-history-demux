const { createClient, createReducer } = require('../lib')

const httpEndpoint = 'https://api.eos.miami'

const client = createClient(httpEndpoint)

const reducer = createReducer({
    client,
    contractName: 'eosio.msig',
    fromAction: 0,
    batchSize: 64,
    handlers: {
      // actions are processed sequentially, therefore handlers can depend on data indexed by previous handler
      'propose': async (transaction) => console.log(`new proposal at action #${transaction.account_action_seq}`),
      'approve': async (transaction) => console.log(`new approval at action #${transaction.account_action_seq}`)
    }
})
