[![Build Status](https://travis-ci.org/7flash/eosio-history-demux.svg?branch=master)](https://travis-ci.org/7flash/eosio-history-demux)
[![Coverage Status](https://coveralls.io/repos/github/7flash/eosio-history-demux/badge.svg?branch=master)](https://coveralls.io/github/7flash/eosio-history-demux?branch=master)
![npm (scoped)](https://img.shields.io/npm/v/eosio-history-demux)

# eosio-history-demux

> Demux is a backend infrastructure pattern for sourcing blockchain events to deterministically update queryable datastores and trigger side effects.
(https://github.com/EOSIO/demux-js)

This library provides efficient implementation of demux pattern using History API.

## Install

```
$ npm install eosio-history-demux
```

## Example

```
const { createClient, createReducer } = require('eosio-history-demux')

const httpEndpoint = 'https://api.eos.miami'

const client = createClient(httpEndpoint)

const reducer = createReducer({
    client,
    contractName: 'eosio.msig',
    fromAction: 0 // number of action in history (optional)
    batchSize: 64 // number of actions per request (optional)
    handlers: {
      // actions are processed sequentially, therefore handlers can depend on data indexed by previous handler
      'propose': async (transaction) => console.log(`new proposal at action #${transaction.account_action_seq}`)
      'approve': async (transaction) => console.log(`new approval at action #${transaction.account_action_seq}`)
    }
})
```
