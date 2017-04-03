var comparisonOperators = require('../comparisonOperators.json')
var logicalOperators = require('../logicalOperators.json')
var setOperators = require('../setOperators.json')
var keywords = require('../keywords.json')

function isKeywordOrOperator (token) {
  if (comparisonOperators.indexOf(token) > -1) return true
  if (logicalOperators.indexOf(token) > -1) return true
  if (setOperators.indexOf(token) > -1) return true

  var TOKEN = token.toUpperCase()
  if (keywords.indexOf(TOKEN) > -1) return true

  return false
}

module.exports = isKeywordOrOperator
