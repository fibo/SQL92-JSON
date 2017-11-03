var isString = require('./isString')

function isStringWithSpace (value) {
  return isString(value) && /\s/.test(value)
}

module.exports = isStringWithSpace
