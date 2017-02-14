var encloseWithParenthesis = require('./util/encloseWithParenthesis')
var quoteIfString = require('./util/quoteIfString')

var isArray = Array.isArray

var comparisonOperators = ['=', '>', '<', '<>', '<=', '>=', '!=']

/**
 * Extract WHERE filter.
 *
 * @param {Object} filter
 *
 * @returns {String} result
 */

function whereFilter (filter) {
  for (var i = 0; i < comparisonOperators.length; i++) {
    var operator = comparisonOperators[i]
    var operand = filter[operator]

    if (typeof operand !== 'undefined') {
      return operator + ' ' + quoteIfString(operand)
    }
  }

  if (isArray(filter.IN)) {
    return 'IN ' + encloseWithParenthesis(filter.IN.map(quoteIfString).join(', '))
  }

  if (isArray(filter.AND)) {
    if (filter.AND.length === 2) {
      return 'AND ' + filter.AND[0] + ' ' + whereFilter(filter.AND[1])
    } else {
      return 'AND ' + encloseWithParenthesis(whereFilter(filter.AND))
    }
  }

  if (isArray(filter.OR)) {
    if (filter.OR.length === 2) {
      return 'AND ' + filter.AND[0] + ' ' + whereFilter(filter.AND[1])
    } else {
      return 'OR ' + encloseWithParenthesis(whereFilter(filter.OR))
    }
  }
}

module.exports = whereFilter
