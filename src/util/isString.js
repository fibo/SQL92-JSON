var isStar = require('./isStar')

function isString (value) {
  return typeof value === 'string' && (!isStar(value))
}

module.exports = isString
