const { Readable } = require('stream')

class ReaderStream extends Readable {
  constructor({ client, contract }) {
    super({ objectMode: true })

    this.client = client
    this.contract = contract

    this.pos = 0
    this.offset = 0
  }

  _read() {

  }

  async readActions() {
    const { actions } = await this.client.rpc.history_get_actions(
      this.contract, this.pos, this.offset
    )

    this.pos += actions.length

    actions.forEach(action => this.push(action))
  }

  start(fromActionNumber) {
    this.pos = fromActionNumber

    this.readActions()
  }
}

module.exports = ReaderStream
