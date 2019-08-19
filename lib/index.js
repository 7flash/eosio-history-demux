module.exports = (input, { postfix = 'awesome' } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`)
  }

  return `${input} is ${postfix}`
}
