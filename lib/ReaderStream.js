const { Readable } = require('stream')

class ReaderStream extends Readable {
  constructor({ client, contractName, fromAction, batchSize }) {
    const highWaterMark = 1

    super({ objectMode: true, highWaterMark })

    this.client = client
    this.contractName = contractName

    this.pos = fromAction || 0
    this.offset = batchSize || 64
    this.terminated = false
  }

  nextBlock() {
    return new Promise(resolve => setTimeout(resolve, 500))
  }

  async fetchNextActions() {
    try {
      const { actions } = await this.client.rpc.history_get_actions(
        this.contractName, this.pos, this.offset
      )

      return actions
    } catch (err) {
      console.error(err)
      return []
    }
  }

  async _read() {
    let actions = []

    while (!actions || actions.length == 0) {
      if (this.terminated) return

      actions = await this.fetchNextActions()
      if (!actions || actions.length == 0) {
        await this.nextBlock()
      }
    }

    this.pos += actions.length

    actions.forEach(action => {
      const result = this.push(action)
    })
  }

  _destroy() {
    this.terminated = true
  }
}

module.exports = ReaderStream
