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

const createReader = ({ client, contract }) => {
  return new ReaderStream({ client, contract })
}

const createWriter = ({ handlers }) => {
  return new WriterStream({ handlers })
}

const processActions = ({ reader, writer, fromBlock }) => {
  reader.pipe(writer)
  reader.start(fromBlock)
}

module.exports = {
  createClient,
  createReader,
  createWriter,
  processActions
}
