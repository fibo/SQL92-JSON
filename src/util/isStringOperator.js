var stringOperators = require('./stringOperators.json')

function isStringOperator (token) {
  return stringOperators.indexOf(token) > -1
}

module.exports = isStringOperator
