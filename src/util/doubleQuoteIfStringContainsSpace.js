var isString = require('./isString')
var isStringWithSpace = require('./isStringWithSpace')

function doubleQuoteIfStringContainsSpace (value) {
  if (isStringWithSpace(value)) {
    return '"' + value + '"'
  }

  if (isString(value)) {
    return value
  }
}

module.exports = doubleQuoteIfStringContainsSpace
