var isString = require('./isString')

function isDoubleQuotedString (value) {
  return isString(value) && /^"[^"]*"$/.test(value)
}

module.exports = isDoubleQuotedString
