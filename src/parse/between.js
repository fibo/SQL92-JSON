var error = require('../error')

var isLogicalOperator = require('../util/isLogicalOperator')
var isKeywordOrOperator = require('../util/isKeywordOrOperator')
var isStringNumber = require('../util/isStringNumber')

var isAnd = isLogicalOperator('AND')

function between (item, left, and, right, not) {
  var json = []
  var interval = {}

  if (not) interval['NOT BETWEEN'] = []
  else interval.BETWEEN = []

  if (!isAnd(and)) throw error.invalidSQL()

  if (isKeywordOrOperator(left) || isKeywordOrOperator(right)) {
    throw error.invalidInterval(left, right)
  }

  if (isStringNumber(left)) {
    left = parseFloat(left)
  }

  if (isStringNumber(right)) {
    right = parseFloat(right)
  }

  if (not) interval['NOT BETWEEN'].push(left, right)
  else interval.BETWEEN.push(left, right)

  json.push(item)
  json.push(interval)

  return json
}

module.exports = between
