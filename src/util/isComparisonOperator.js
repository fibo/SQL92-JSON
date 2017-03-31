var comparisonOperators = require('../comparisonOperators.json')

function isComparisonOperator (operator) {
  return function (token) {
    if (comparisonOperators.indexOf(operator) === -1) return false

    return operator === token
  }
}

module.exports = isComparisonOperator
