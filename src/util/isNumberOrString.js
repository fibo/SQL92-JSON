var isNumber = require('./isNumber')
var isString = require('./isString')

function isNumberOrString (value) {
  return isNumber(value) || isString(value)
}

module.exports = isNumberOrString
