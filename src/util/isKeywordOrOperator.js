var comparisonOperators = require('../comparisonOperators.json')
var keywords = require('../keywords.json')

function isKeywordOrOperator (token) {
  if (comparisonOperators.indexOf(token) > -1) return true

  var TOKEN = token.toUpperCase()
  if (keywords.indexOf(TOKEN) > -1) return true

  return false
}

module.exports = isKeywordOrOperator
