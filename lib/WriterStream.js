const { Writable } = require('stream')

class WriterStream extends Writable {
  constructor({ handlers }) {
    super({ objectMode: true })

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

    // pass transaction to handler found by action type
    // call callback after successful transaction execution
  }
}

module.exports = WriterStream
