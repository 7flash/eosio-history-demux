const fetch = require('node-fetch')
const { JsonRpc, Api } = require('eosjs')
const { TextEncoder, TextDecoder } = require('util')

const ReaderStream = require('./ReaderStream')
const WriterStream = require('./WriterStream')

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const createClient = (httpEndpoint) => {
  const rpc = new JsonRpc(httpEndpoint, { fetch })
  const client = new Api({ rpc, textEncoder, textDecoder })
  return client
}

const createReader = ({ client, contractName, fromAction, batchSize }) => {
  return new ReaderStream({ client, contractName, fromAction, batchSize })
}

const createWriter = ({ handlers, batchSize }) => {
  return new WriterStream({ handlers, batchSize })
}

const createReducer = ({ client, contractName, fromAction, batchSize, handlers }) => {
  const reader = createReader({ client, contractName, fromAction, batchSize })
  const writer = createWriter({ handlers, batchSize })
  const reducer = reader.pipe(writer)

  return {
    stop: async () => {
      await reducer.destroy()
      await writer.destroy()
      await reader.destroy()
    }
  }
}

module.exports = {
  createClient,
  createReducer
}
