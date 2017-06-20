var condition = require('./condition')

var isAnyJoin = require('../util/isAnyJoin')
var countTokens = require('../util/countTokens')
var isKeyword = require('../util/isKeyword')
var isTableName = require('../util/isTableName')

var isOn = isKeyword('ON')

function join (tokens, startIndex, select, sql) {
  var numTokens = tokens.length
  var joinExpression = {}

  for (var j = startIndex; j < numTokens; j++) {
    var token = tokens[j]
    var nextToken = tokens[j + 1]

    if (isAnyJoin(token)) {
      joinExpression[token] = join(tokens, j + 1, select, sql)
      break
    }

    if (isOn(token)) {
      joinExpression.ON = condition(tokens, j, select, sql)
      j += countTokens(joinExpression.ON)
      continue
    }

    if (isTableName(token)) {
      joinExpression[nextToken] = token
      j++
    }
  }

  return joinExpression
}

module.exports = join
