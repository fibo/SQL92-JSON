var isString = require('./isString')

function isSingleQuotedString (value) {
  return isString(value) && /^'[^']*'$/.test(value)
}

module.exports = isSingleQuotedString
