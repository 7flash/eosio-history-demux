const { describe, Try } = require('riteway')
const example = require('../lib')

describe('Module', async assert => {
  assert({
    given: 'diadem',
    should: 'return correct string',
    actual: example('diadem'),
    expected: 'diadem is awesome'
  })

  assert({
    given: 'undefined',
    should: 'throw',
    actual: Try(example),
    expected: new TypeError()
  })
})
