const { Writable } = require('stream')

class WriterStream extends Writable {
  constructor({ handlers, batchSize }) {
    const highWaterMark = batchSize || 64

    super({ objectMode: true, highWaterMark })

    this.handlers = handlers
  }

  async _write(transaction, encoding, callback) {
    try {
      const actionName = transaction.action_trace.act.name

      await this.handlers[actionName]()
    } catch (err) {
      console.error(err)
    }

    callback()
  }
}

module.exports = WriterStream
