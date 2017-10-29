var isStar = require('./isStar')

function isString (value) {
  if (typeof value === 'string') {
    return (['(', ',', ')'].indexOf(value) === -1) && (!isStar(value))
  } else {
    return false
  }
}

module.exports = isString
