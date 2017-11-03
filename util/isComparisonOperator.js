var comparisonOperators = require('./comparisonOperators.json')

function isComparisonOperator (token) {
  return comparisonOperators.indexOf(token) > -1
}

module.exports = isComparisonOperator
