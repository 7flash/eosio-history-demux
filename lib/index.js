const fetch = require('node-fetch')
const { JsonRpc, Api } = require('eosjs')
const { TextEncoder, TextDecoder } = require('util')

const ReaderStream = require('./ReaderStream')
const WriterStream = require('./WriterStream')

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const createClient = ({ httpEndpoint }) => {
  const rpc = new JsonRpc(httpEndpoint, { fetch })
  const client = new Api({ rpc, textEncoder, textDecoder })
  return client
}

const createReader = ({ client, contract, fromAction, batchSize }) => {
  return new ReaderStream({ client, contract, fromAction, batchSize })
}

const createWriter = ({ handlers, batchSize }) => {
  return new WriterStream({ handlers, batchSize })
}

const processActions = ({ reader, writer }) => {
  reader.pipe(writer)
}

const createReducer = ({ client, contract, handlers, fromAction, batchSize }) => {
  const reader = createReader({ client, contract, fromAction, batchSize })
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
