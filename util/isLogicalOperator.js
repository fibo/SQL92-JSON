var logicalOperators = require('./logicalOperators.json')

function isLogicalOperator (operator) {
  return function (token) {
    var TOKEN = token.toUpperCase()

    if (logicalOperators.indexOf(TOKEN) === -1) return false

    return operator === TOKEN
  }
}

module.exports = isLogicalOperator
