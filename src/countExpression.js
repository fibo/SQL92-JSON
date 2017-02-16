var aliasExpression = require('./aliasExpression')
var isStar = require('./util/isStar')
var isString = require('./util/isString')

/**
 * Stringify COUNT expression
 *
 * @param {Object} json
 *
 * @returns {String} result
 */

function countExpression (json) {
  var result = ''

  var COUNT = json.COUNT

  if (isStar(COUNT)) result = 'COUNT(*)'
  if (COUNT === 1) result = 'COUNT(1)'
  if (isString(COUNT)) result = 'COUNT(' + COUNT + ')'

  return result + aliasExpression(json)
}

module.exports = countExpression
